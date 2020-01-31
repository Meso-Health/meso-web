import { createSelector } from 'reselect';
import { flow, filter } from 'lodash/fp';

export const deltasSelector = state => Object.values(state.deltas.deltas);

export const unsyncedDeltasByModelType = createSelector(
  (_, modelType) => modelType,
  deltasSelector,
  (modelType, deltas) => (
    flow(
      filter(delta => delta.modelType === modelType),
      filter(delta => !delta.synced),
    )(deltas)
  ),
);

export const countUnsyncedDeltasByModelType = createSelector(
  unsyncedDeltasByModelType,
  deltas => deltas.length,
);
