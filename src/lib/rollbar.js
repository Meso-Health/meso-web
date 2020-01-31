import Rollbar from 'rollbar';

const rollbarInstance = new Rollbar({
  accessToken: process.env.REACT_APP_ROLLBAR_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: process.env.NODE_ENV,
  },
  autoInstrument: { log: false },
});

const rollbar = {
  logApiError: ({ method, url, error, params = null, data = null }) => {
    rollbarInstance.error(
      `${method} ${url} failed with ${error}\n
      params: ${params}\n
      data: ${data}`,
    );
  },
  logError: ({ message }) => {
    rollbarInstance.error(message);
  },
  setUser: (user) => {
    rollbarInstance.configure({
      payload: {
        person: {
          id: user.id,
          username: user.username,
        },
      },
    });
  },
  removeUser: () => {
    rollbarInstance.configure({
      payload: {
        person: {
          id: null,
        },
      },
    });
  },
};

export default rollbar;
