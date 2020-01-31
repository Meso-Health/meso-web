import { schema } from 'normalizr';

import memberSchema from 'store/schemas/member-schema';
import diagnosisSchema from 'store/schemas/diagnosis-schema';
import billableSchema from './billable-schema';
import priceScheduleSchema from './price-schedule-schema';

const encounterSchema = new schema.Entity('encounters');
export default encounterSchema;

const encounterWithMemberSchema = new schema.Entity('encounters');
encounterWithMemberSchema.define({
  member: memberSchema,
  diagnoses: [diagnosisSchema],
  billables: [billableSchema],
  priceSchedules: [priceScheduleSchema],
});

export { encounterWithMemberSchema };
