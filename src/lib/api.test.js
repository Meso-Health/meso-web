import api from 'lib/api';

const TOKEN = 'token-abcd';
const PAYER_ADMIN_USER = {
  name: 'Ellen Smith',
  username: 'ellensmith',
  role: 'payer_admin',
};
const INVALID_ROLE_USER = {
  name: 'David Jones',
  username: 'david',
  role: 'invalid',
};

/**
 * Tests
 */

describe('api', () => {
  describe('login', () => {
    const setLoginResponseForUser = (user) => {
      mockAdapter.reset();

      mockAdapter.onPost('/authentication_token').reply(200, {
        token: TOKEN,
        expires_at: '2017-01-01T12:00:00Z',
        user,
      });
    };

    it('throws a 403 Unauthorized Error for clinic / enrollment users', async () => {
      setLoginResponseForUser(PAYER_ADMIN_USER);

      try {
        await api.login('user', 'password');
      } catch (err) {
        throw new Error('Expected not to throw');
      }

      setLoginResponseForUser(INVALID_ROLE_USER);

      try {
        await api.login('user', 'password');
      } catch (err) {
        expect(err.response.status).toEqual(403);
      }
    });
  });
});
