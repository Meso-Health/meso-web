import { isUndefined, isString, isFunction } from 'lodash/fp';
import { isCancel } from 'axios';
import { matchesRole, isPromise } from 'lib/utils';

/**
 * API Redux middleware
 *
 * This middleware removes the REQUEST, SUCCESS, FAILURE boilerplate of Redux
 * actions with the API. To use it, dispatch an action with `CALL_API` as a key,
 * and inside, specify the parameters of the call.
 *
 * This middleware was based off of the example from the Redux repo:
 * https://github.com/reactjs/redux/blob/master/examples/real-world/src/middleware/api.js
 *
 * @param {Array} types - An array of action types in order: request, success, failure
 * @param {Function} call - The API method to call. Arguments `(api, dispatch, getState)`
 * @param {Array|String} allowedRoles - The user roles allowed to make this request.
 *   When the user's role is not included, the request is silently ignored.
 * @param {Function} beforeRequest - Called before the request. You can
 *   prevent the request by returning a Promise.
 * @param {Function} afterResponse - Called after the response.
 * @param {Function} transformResponse - Called with `response` before creating success action.
 *   Use this to apply your presenters or other transformations.
 * @param {Function} transformError - Called with `error` on before creating error action.
 *   Use this to customize the `errorMessage` passed to the reducer.
 */

const withApi = api => ({ dispatch, getState }) => next => (action) => {
  const params = action.CALL_API;

  if (isUndefined(params)) {
    return next(action);
  }

  const {
    types,
    call,
    allowedRoles,
    beforeRequest = () => undefined,
    afterResponse = response => response,
    transformError = err => err && err.message,
    transformResponse = response => response,
  } = params;

  if (process.env.NODE_ENV === 'development') {
    if (!isFunction(call)) {
      throw new Error('Expected \'call\' to be a function in CALL_API action');
    }

    const ALLOWED_ACTION_TYPE_LENGTHS = [3, 4];
    if (!Array.isArray(types) || !ALLOWED_ACTION_TYPE_LENGTHS.includes(types.length)) {
      throw new Error('Expected \'types\' to be an array of three or four action types');
    }

    if (!types.every(isString)) {
      throw new Error('Expected \'types\' to be strings');
    }
  }

  if (Array.isArray(allowedRoles)) {
    const currentUser = getState().auth.user;
    const isAllowedRole = matchesRole(allowedRoles);

    if (!currentUser || !currentUser.role || !isAllowedRole(currentUser.role)) {
      return Promise.resolve();
    }
  }

  const actionWith = (data) => {
    const finalAction = { ...action, ...data };
    delete finalAction.CALL_API;
    return finalAction;
  };

  const [requestType, successType, failureType, cancelType] = types;

  const beforeResult = beforeRequest(dispatch, getState, api);

  if (isPromise(beforeResult)) {
    return beforeResult;
  }

  next(actionWith({ type: requestType }));

  const callPromise = call(api, dispatch, getState);

  if (!isPromise(callPromise)) {
    throw new Error('Expected \'call\' to be a function that returns a Promise');
  }

  return callPromise
    .then(response => next(actionWith({
      type: successType,
      response: transformResponse(response, dispatch, getState),
    })))
    .then(successAction => successAction.response)
    .then((response) => {
      afterResponse(response, dispatch, getState);
      return response;
    })
    .catch((err) => {
      if (isCancel(err)) {
        return next(actionWith({ type: cancelType }));
      }
      return next(actionWith({ type: failureType, errorMessage: transformError(err) }));
    });
};

export default withApi;
