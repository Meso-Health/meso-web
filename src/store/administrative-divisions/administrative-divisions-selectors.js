import { createSelector } from 'reselect';
import { concat, filter, flow, isEmpty, map, values, without } from 'lodash/fp';

import { ADMIN_DIVISIONS } from 'lib/config';

import { userSelector } from 'store/auth/auth-selectors';

export const administrativeDivisionsByIdSelector = state => state.administrativeDivisions.administrativeDivisions;

export const administrativeDivisionsSelector = state => values(state.administrativeDivisions.administrativeDivisions);

// return all administrative divisions that reside under the supplied parent divisions (inclusive)
export const recurseDivisionsOfParent = (parentIds, remainingDivisions, filteredDivisions = []) => {
  if (parentIds == null || isEmpty(parentIds) || isEmpty(remainingDivisions)) {
    return filteredDivisions;
  }

  const matchingDivisions = filter(
    ad => parentIds.includes(ad.id) || parentIds.includes(ad.parentId),
  )(remainingDivisions);

  return recurseDivisionsOfParent(
    map(ad => ad.id)(matchingDivisions),
    without(matchingDivisions)(remainingDivisions),
    filteredDivisions.concat(matchingDivisions),
  );
};

export const secondLevelFilterOptionsSelector = createSelector(
  administrativeDivisionsByIdSelector,
  (administrativeDivisions) => {
    const secondLevels = flow(
      filter(ad => ad.level === ADMIN_DIVISIONS.SECOND_LEVEL),
      map(ad => ({ value: ad.id, name: ad.name })),
    )(administrativeDivisions);
    return [
      { value: 'none', name: `All ${ADMIN_DIVISIONS.SECOND_LEVEL}` },
      ...secondLevels,
    ];
  },
);

const getParentDivisions = (user, administrativeDivisionsById) => {
  const parentDivisions = [];
  const userDivision = administrativeDivisionsById[user.administrativeDivisionId];

  let parentDivision = userDivision && administrativeDivisionsById[userDivision.parentId];
  while (parentDivision) {
    parentDivisions.push(parentDivision);
    parentDivision = administrativeDivisionsById[parentDivision.parentId];
  }

  return parentDivisions;
};

export const viewableAdminDivisionIdsSelector = createSelector(
  administrativeDivisionsByIdSelector,
  userSelector,
  (administrativeDivisionsById, user) => {
    if (!user || !administrativeDivisionsById) {
      return [];
    }

    if (user && !user.administrativeDivisionId) {
      return map(adminDivision => adminDivision.id)(administrativeDivisionsById);
    }

    const childDivisions = recurseDivisionsOfParent(
      [user.administrativeDivisionId],
      values(administrativeDivisionsById),
    );

    const parentDivisions = getParentDivisions(user, administrativeDivisionsById);

    return map(adminDivision => adminDivision.id)(concat(childDivisions, parentDivisions));
  },
);

// This isn't going to work in other locales
export const isBranchOrHQUserSelector = createSelector(
  userSelector,
  administrativeDivisionsByIdSelector,
  (user, administrativeDivisions) => {
    // TODO: convert this into a role check
    const userDivision = administrativeDivisions[user.administrativeDivisionId];
    return userDivision && ['branch', 'region', 'zone'].includes(userDivision.level);
  },
);
