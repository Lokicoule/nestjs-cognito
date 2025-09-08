import { CookieJwtExtractor } from './cookie-jwt.extractor';

describe('CookieJwtExtractor', () => {
  describe('with default cookie name', () => {
    let extractor: CookieJwtExtractor;

    beforeEach(() => {
      extractor = new CookieJwtExtractor();
    });

    describe('hasAuthenticationInfo', () => {
      it.each([
        ['HTTP request has jwt cookie', { headers: { cookie: 'jwt=token123; other=value' } }],
        ['WebSocket request has jwt cookie', { handshake: { headers: { cookie: 'jwt=token456; other=value' } } }]
      ])('should return true when %s', (_, request) => {
        expect(extractor.hasAuthenticationInfo(request)).toBe(true);
      });

      it.each([
        ['jwt cookie is empty', { headers: { cookie: 'jwt=; other=value' } }],
        ['jwt cookie is whitespace', { headers: { cookie: 'jwt=   ; other=value' } }],
        ['no jwt cookie exists', { headers: { cookie: 'other=value; another=test' } }],
        ['no cookie header exists', { headers: {} }],
        ['no headers exist', {}],
        ['request is null', null],
        ['request is undefined', undefined]
      ])('should return false when %s', (_, request) => {
        expect(extractor.hasAuthenticationInfo(request)).toBe(false);
      });
    });

    describe('getAuthorizationToken', () => {
      it.each([
        ['HTTP request jwt cookie', { headers: { cookie: 'jwt=token123; other=value' } }, 'token123'],
        ['WebSocket request jwt cookie', { handshake: { headers: { cookie: 'jwt=token456; other=value' } } }, 'token456'],
        ['cookie with spaces around equals', { headers: { cookie: 'jwt = token789; other=value' } }, 'token789'],
        ['cookie at beginning', { headers: { cookie: 'jwt=firsttoken; other=value' } }, 'firsttoken'],
        ['cookie at end', { headers: { cookie: 'other=value; jwt=lasttoken' } }, 'lasttoken']
      ])('should extract token from %s', (_, request, expected) => {
        expect(extractor.getAuthorizationToken(request)).toBe(expected);
      });

      it.each([
        ['jwt cookie is empty', { headers: { cookie: 'jwt=; other=value' } }],
        ['no jwt cookie exists', { headers: { cookie: 'other=value; another=test' } }],
        ['no cookie header exists', { headers: {} }],
        ['no headers exist', {}],
        ['request is null', null],
        ['request is undefined', undefined]
      ])('should return null when %s', (_, request) => {
        expect(extractor.getAuthorizationToken(request)).toBeNull();
      });
    });
  });

  describe('with custom cookie name', () => {
    let extractor: CookieJwtExtractor;
    const customCookieName = 'accessToken';

    beforeEach(() => {
      extractor = new CookieJwtExtractor(customCookieName);
    });

    it.each([
      ['hasAuthenticationInfo', 'hasAuthenticationInfo'],
      ['getAuthorizationToken', 'getAuthorizationToken']
    ])('should use custom cookie name for %s', (_, method) => {
      const requestWithCustom = { headers: { cookie: 'accessToken=token123; other=value' } };
      const requestWithDefault = { headers: { cookie: 'jwt=token123; other=value' } };

      if (method === 'hasAuthenticationInfo') {
        expect(extractor.hasAuthenticationInfo(requestWithCustom)).toBe(true);
        expect(extractor.hasAuthenticationInfo(requestWithDefault)).toBe(false);
      } else {
        expect(extractor.getAuthorizationToken(requestWithCustom)).toBe('token123');
        expect(extractor.getAuthorizationToken(requestWithDefault)).toBeNull();
      }
    });
  });
});