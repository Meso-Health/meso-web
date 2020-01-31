import { values, filter, flow, orderBy } from 'lodash/fp';

export const identificationEventsArraySelector = state => values(state.identificationEvents.identificationEvents);

export const identificationEventsByIdSelector = state => state.identificationEvents.identificationEvents;

export const openIdentificationEventsSelector = state => (
  filter(idEvent => idEvent.dismissed === false)(state.identificationEvents.identificationEvents)
);

export const openIdentificationEventsByMemberIdSelector = (state, memberId) => (
  flow(
    filter(identificationEvent => identificationEvent.memberId === memberId),
    filter(identificationEvent => identificationEvent.dismissed === false),
    orderBy(identificationEvent => new Date(identificationEvent.occurredAt), ['desc']),
  )(state.identificationEvents.identificationEvents)
);
