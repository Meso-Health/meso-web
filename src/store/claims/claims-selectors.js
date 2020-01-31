import { createSelector } from 'reselect';
import { keyBy, last, map, orderBy } from 'lodash/fp';
import { encountersKeyedByIdSelector } from 'store/encounters/encounters-selectors';
import { objectHasProp } from '../../lib/utils';

export const claimsKeyedByIdSelector = state => state.claims.claims;

export const claimByEncounterIdSelector = createSelector(
  (_, encounterId) => encounterId,
  encountersKeyedByIdSelector,
  claimsKeyedByIdSelector,
  (encounterId, encounters, claims) => {
    if (objectHasProp(encounters, encounterId)) {
      const { claimId } = encounters[encounterId];

      if (objectHasProp(claims, claimId)) {
        const claim = claims[claimId];
        const claimEncounters = map(eId => encounters[eId])(claim.encounters);
        const orderedClaimEncounters = orderBy(e => new Date(e.submittedAt), ['asc'])(claimEncounters);
        const lastEncounter = last(orderedClaimEncounters);
        const claimEncountersKeyedById = keyBy('id', orderedClaimEncounters);
        return { ...claim, encounters: claimEncountersKeyedById, lastEncounter };
      }
    }
    return null;
  },
);
