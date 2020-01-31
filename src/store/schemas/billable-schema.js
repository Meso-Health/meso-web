import { schema } from 'normalizr';
import priceScheduleSchema from './price-schedule-schema';

const billableSchema = new schema.Entity('billables');

billableSchema.define({
  activePriceSchedule: priceScheduleSchema,
});

export default billableSchema;
