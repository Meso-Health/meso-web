import { schema } from 'normalizr';

import encounterSchema from 'store/schemas/encounter-schema';
import memberSchema from 'store/schemas/member-schema';

const identificationEventWithMemberAndEncounterSchema = new schema.Entity('identificationEvents');
identificationEventWithMemberAndEncounterSchema.define({
  member: memberSchema,
  encounter: encounterSchema,
});

export default identificationEventWithMemberAndEncounterSchema;
