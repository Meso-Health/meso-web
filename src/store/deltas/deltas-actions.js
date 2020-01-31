export const CREATE_DELTA = 'CREATE_DELTA';
export const DELETE_DELTA = 'DELETE_DELTA';

export const createDelta = delta => ({
  type: CREATE_DELTA,
  delta,
});

export const deleteDelta = deltaId => ({
  type: DELETE_DELTA,
  deltaId,
});
