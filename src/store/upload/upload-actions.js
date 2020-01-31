import { unsyncedDeltasByModelType } from 'store/deltas/deltas-selectors';
import { identificationEventsByIdSelector } from 'store/identification-events/identification-events-selectors';
import { priceSchedulesKeyedByIdSelector } from 'store/price-schedules/price-schedules-selectors';
import { encountersKeyedByIdSelector } from 'store/encounters/encounters-selectors';
import { membersKeyedByIdSelector } from 'store/members/members-selectors';
import { deleteDelta as deleteDeltaAction } from 'store/deltas/deltas-actions';
import api from 'lib/api';
import rollbar from 'lib/rollbar';
import session from 'lib/session';
import moment from 'moment';

export const uploadData = () => (
  async (dispatch, getState) => {
    const state = getState();
    const unsyncedPriceScheduleDeltas = unsyncedDeltasByModelType(state, 'PriceSchedule');
    const priceSchedulesById = priceSchedulesKeyedByIdSelector(state);
    const encountersById = encountersKeyedByIdSelector(state);
    const identificationEventsById = identificationEventsByIdSelector(state);
    const membersById = membersKeyedByIdSelector(state);
    const { providerId } = state.auth.user;

    // sync members
    const unsyncedMemberDeltas = unsyncedDeltasByModelType(state, 'Member');
    const syncMembers = () => Promise.all(
      unsyncedMemberDeltas.map(async (memberDelta) => {
        const member = membersById[memberDelta.modelId];
        if (memberDelta.action === 'PATCH') {
          // TODO: when we support patching while offline.
        } else {
          try {
            await api.postMember(member);
            dispatch(deleteDeltaAction(memberDelta.id));
            session.setLastUploadTimestamp(moment().format());
          } catch (error) {
            rollbar.logError({ message: `POST member with id ${memberDelta.id} failed with error: ${error}` });
          }
        }
        return Promise.resolve();
      }),
    );

    // Sync price schedules
    const syncPriceSchedules = () => Promise.all(
      unsyncedPriceScheduleDeltas.map(async (priceScheduleDelta) => {
        const priceSchedule = priceSchedulesById[priceScheduleDelta.modelId];
        try {
          await api.postPriceSchedule(priceSchedule, providerId);
          dispatch(deleteDeltaAction(priceScheduleDelta.id));
          session.setLastUploadTimestamp(moment().format());
        } catch (error) {
          rollbar.logError(`POST price schedule with id ${priceScheduleDelta.id} failed with error: ${error}`);
        }
        return Promise.resolve();
      }),
    );

    // Sync id events
    const unsyncedIdEventDeltas = unsyncedDeltasByModelType(state, 'IdentificationEvent');
    const syncIdentificationEvents = () => Promise.all(
      unsyncedIdEventDeltas.map(async (idEventDelta) => {
        const idEvent = identificationEventsById[idEventDelta.modelId];
        if (idEventDelta.action === 'PATCH') {
          // TODO: Implement when we support patching.
        } else {
          try {
            await api.postIdentificationEvent(idEvent, providerId);
            dispatch(deleteDeltaAction(idEventDelta.id));
            session.setLastUploadTimestamp(moment().format());
          } catch (error) {
            rollbar.logError(`PATCH identificationEvent with id ${idEventDelta.id} failed with error: ${error}`);
          }
        }
      }),
    );

    // Sync encounters
    const unsyncedEncounterDeltas = unsyncedDeltasByModelType(state, 'Encounter');
    const syncEncounters = () => Promise.all(
      unsyncedEncounterDeltas.map(async (encounterDelta) => {
        const encounter = encountersById[encounterDelta.modelId];
        if (encounterDelta.action === 'PATCH') {
          try {
            await api.patchEncounter(encounter, providerId);
            dispatch(deleteDeltaAction(encounterDelta.id));
            session.setLastUploadTimestamp(moment().format());
          } catch (error) {
            rollbar.logError(`PATCH encounter with id ${encounterDelta.id} failed with error: ${error}`);
          }
        } else {
          try {
            await api.postEncounter(encounter, providerId);
            dispatch(deleteDeltaAction(encounterDelta.id));
            session.setLastUploadTimestamp(moment().format());
          } catch (error) {
            rollbar.logError(`POST encounter with id ${encounterDelta.id} failed with error: ${error}`);
          }
        }
        return Promise.resolve();
      }),
    );

    // TODO: move these methods into their own file.
    // TODO: change the calls to api to dispatch redux actions.
    await syncMembers();
    await syncPriceSchedules();
    await syncIdentificationEvents();
    await syncEncounters();
  }
);

export default uploadData;
