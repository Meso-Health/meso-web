import { omit } from 'lodash';
import localforage from 'localforage';
import { createMigrate, createTransform } from 'redux-persist';
import {
  omittableFields as encountersOmittableFields,
  initialState as encountersInitialState,
} from 'store/encounters/encounters-reducers';
import {
  omittableFields as billablesOmittableFields,
  initialState as billablesInitialState,
} from 'store/billables/billables-reducers';
import {
  omittableFields as diagnosesOmittableFields,
  initialState as diagnosesInitialState,
} from 'store/diagnoses/diagnoses-reducers';
import {
  omittableFields as membersOmittableFields,
  initialState as membersInitialState,
} from 'store/members/members-reducers';
import {
  omittableFields as priceSchedulesOmittableFields,
  initialState as priceSchedulesInitialState,
} from 'store/price-schedules/price-schedules-reducers';
import {
  omittableFields as providersOmittableFields,
  initialState as providersInitialState,
} from 'store/providers/providers-reducers';

localforage.config({
  name: 'localforageDB',
});

const migrations = {
  1: (state) => {
    console.log('migration 1 ran');
    return {
      ...state,
      diagnoses: {
        isLoadingDiagnoses: false,
        diagnosesError: '',
        diagnoses: state.diagnoses.diagnoses.map(
          // Mark every diagnosis in the store as active: true
          diagnosis => (
            {
              ...diagnosis,
              active: true,
            }
          ),
        ),
      },
    };
  },
  2: (state) => {
    console.log('migration 2 ran');
    return {
      ...state,
      encounters: {
        isLoadingEncounters: false,
        encountersError: '',
        encounters: state.encounters.encounters.map(
          // Copy every encounter.adjuducationReason to adjudicationComment field.
          encounter => (
            {
              ...encounter,
              adjudicationComment: encounter.adjudicationReason,
            }
          ),
        ),
      },
    };
  },
};

const blacklistTransform = createTransform(
  (inboundState, key) => {
    switch (key) {
      case 'encounter': {
        const omittedState = omit(inboundState, encountersOmittableFields);
        return ({ ...encountersInitialState, ...omittedState });
      }
      case 'diagnoses': {
        const omittedState = omit(inboundState, diagnosesOmittableFields);
        return ({ ...diagnosesInitialState, ...omittedState });
      }
      case 'billables': {
        const omittedState = omit(inboundState, billablesOmittableFields);
        return ({ ...billablesInitialState, ...omittedState });
      }
      case 'members': {
        const omittedState = omit(inboundState, membersOmittableFields);
        return ({ ...membersInitialState, ...omittedState });
      }
      case 'priceSchedules': {
        const omittedState = omit(inboundState, priceSchedulesOmittableFields);
        return ({ ...priceSchedulesInitialState, ...omittedState });
      }
      case 'providers': {
        const omittedState = omit(inboundState, providersOmittableFields);
        return ({ ...providersInitialState, ...omittedState });
      }
      default:
        return inboundState;
    }
  },
);

const persistConfig = {
  key: 'root',
  version: 2, // Think of this as DB versioning for migrations
  storage: localforage,
  whitelist: [
    'diagnoses',
    'deltas',
    'billables',
    'priceSchedules',
    'encounters',
    'members',
    'identificationEvents',
    'providers',
  ], // This is a whitelist of stores that are available offline.
  transforms: [blacklistTransform],
  migrate: createMigrate(migrations, { debug: true }),
};

export default persistConfig;
