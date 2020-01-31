import { schema } from 'normalizr';

import memberSchema from 'store/schemas/member-schema';

const householdSchema = new schema.Entity('households');

householdSchema.define({
  members: [memberSchema],
});

export default householdSchema;
