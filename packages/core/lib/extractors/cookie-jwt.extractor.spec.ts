import { CookieJwtExtractor } from './cookie-jwt.extractor';

describe('CookieJwtExtractor', () => {
  describe('with default cookie name', () => {
    let extractor: CookieJwtExtractor;

    beforeEach(() => {
      extractor = new CookieJwtExtractor();
    });

    describe('hasAuthenticationInfo', () => {
      it.each([
        ['HTTP request has access_token cookie', { cookies: { access_token: 'token123' } }],
        ['request with cookies object', { cookies: { access_token: 'token456', other: 'value' } }]
      ])('should return true when %s', (_, request) => {
        expect(extractor.hasAuthenticationInfo(request)).toBe(true);
      });

      it.each([
        ['access_token cookie is empty', { cookies: { access_token: '' } }],
        ['access_token cookie is whitespace', { cookies: { access_token: '   ' } }],
        ['no access_token cookie exists', { cookies: { other: 'value', another: 'test' } }],
        ['no cookies exist', { cookies: {} }],
        ['no cookies property', {}],
        ['request is null', null],
        ['request is undefined', undefined]
      ])('should return false when %s', (_, request) => {
        expect(extractor.hasAuthenticationInfo(request)).toBe(false);
      });
    });

    describe('getAuthorizationToken', () => {
      it.each([
        ['HTTP request access_token cookie', { cookies: { access_token: 'token123' } }, 'token123'],
        ['request with multiple cookies', { cookies: { access_token: 'token456', other: 'value' } }, 'token456'],
        ['cookie with whitespace', { cookies: { access_token: '  token789  ' } }, 'token789']
      ])('should extract token from %s', (_, request, expected) => {
        expect(extractor.getAuthorizationToken(request)).toBe(expected);
      });

      it.each([
        ['access_token cookie is empty', { cookies: { access_token: '' } }],
        ['access_token cookie is whitespace', { cookies: { access_token: '   ' } }],
        ['no access_token cookie exists', { cookies: { other: 'value', another: 'test' } }],
        ['no cookies exist', { cookies: {} }],
        ['no cookies property', {}],
        ['request is null', null],
        ['request is undefined', undefined]
      ])('should return null when %s', (_, request) => {
        expect(extractor.getAuthorizationToken(request)).toBeNull();
      });
    });
  });

  describe('with custom cookie name', () => {
    let extractor: CookieJwtExtractor;
    const customCookieName = 'jwt';

    beforeEach(() => {
      extractor = new CookieJwtExtractor(customCookieName);
    });

    it.each([
      ['hasAuthenticationInfo', 'hasAuthenticationInfo'],
      ['getAuthorizationToken', 'getAuthorizationToken']
    ])('should use custom cookie name for %s', (_, method) => {
      const requestWithCustom = { cookies: { jwt: 'token123' } };
      const requestWithDefault = { cookies: { access_token: 'token123' } };

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