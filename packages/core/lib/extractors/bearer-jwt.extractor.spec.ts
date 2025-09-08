import { BearerJwtExtractor } from './bearer-jwt.extractor';

describe('BearerJwtExtractor', () => {
  let extractor: BearerJwtExtractor;

  beforeEach(() => {
    extractor = new BearerJwtExtractor();
  });

  describe('hasAuthenticationInfo', () => {
    it.each([
      ['HTTP request', { headers: { authorization: 'Bearer token123' } }],
      ['WebSocket request', { handshake: { headers: { authorization: 'Bearer token123' } } }]
    ])('should return true when %s has authorization header', (_, request) => {
      expect(extractor.hasAuthenticationInfo(request)).toBe(true);
    });

    it.each([
      ['empty', ''],
      ['whitespace', '   ']
    ])('should return false when authorization header is %s', (_, authValue) => {
      const request = { headers: { authorization: authValue } };
      expect(extractor.hasAuthenticationInfo(request)).toBe(false);
    });

    it.each([
      ['no authorization header', { headers: {} }],
      ['no headers', {}],
      ['null request', null],
      ['undefined request', undefined]
    ])('should return false when %s', (_, request) => {
      expect(extractor.hasAuthenticationInfo(request)).toBe(false);
    });
  });

  describe('getAuthorizationToken', () => {
    it.each([
      ['HTTP request', { headers: { authorization: 'Bearer token123' } }, 'token123'],
      ['WebSocket request', { handshake: { headers: { authorization: 'Bearer token456' } } }, 'token456'],
      ['without Bearer prefix', { headers: { authorization: 'token789' } }, 'token789'],
      ['multiple Bearer prefixes', { headers: { authorization: 'Bearer Bearer token123' } }, 'Bearer token123']
    ])('should extract token from %s', (_, request, expected) => {
      expect(extractor.getAuthorizationToken(request)).toBe(expected);
    });

    it.each([
      ['no authorization header in HTTP request', { headers: {} }],
      ['no authorization header in WebSocket request', { handshake: { headers: {} } }],
      ['empty authorization header', { headers: { authorization: '' } }],
      ['no headers', {}],
      ['null request', null],
      ['undefined request', undefined]
    ])('should return null when %s', (_, request) => {
      expect(extractor.getAuthorizationToken(request)).toBeNull();
    });
  });
});