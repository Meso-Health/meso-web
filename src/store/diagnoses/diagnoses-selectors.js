import { createSelector } from 'reselect';
import { filter, map, orderBy, flow } from 'lodash/fp';
import { objectHasProp } from 'lib/utils';

export const diagnosesKeyedByIdSelector = state => state.diagnoses.diagnoses;

export const getDiagnosesNames = (diagnosisIds, diagnoses) => {
  // TODO: decide what we should do if the diagnosis ID isn't in diagnoses
  if (diagnoses) {
    return diagnosisIds.map(diagnosisId => (objectHasProp(diagnoses, diagnosisId)
      ? diagnoses[diagnosisId].description
      : 'UNK'));
  }
  return [];
};

export const activeDiagnosesSelector = createSelector(
  diagnosesKeyedByIdSelector,
  diagnoses => flow(
    filter(d => d.active),
    orderBy(['name'], ['asc']),
  )(diagnoses),
);

export const flaggableDiagnosesIdsSelector = createSelector(
  diagnosesKeyedByIdSelector,
  (diagnoses) => {
    const flaggableRegex = /.*pregnan.*/i;
    const flaggable = filter(d => d.description.match(flaggableRegex))(diagnoses);
    return map(d => d.id)(flaggable);
  },
);
