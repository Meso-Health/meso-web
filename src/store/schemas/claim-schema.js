import { schema } from 'normalizr';

import { encounterWithMemberSchema } from 'store/schemas/encounter-schema';

const claimSchema = new schema.Entity('claims');
claimSchema.define({
  encounters: [encounterWithMemberSchema],
});

export default claimSchema;
