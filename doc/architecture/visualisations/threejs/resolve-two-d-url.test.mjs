import test from 'node:test';
import assert from 'node:assert/strict';

import { resolveTwoDUrl } from './resolve-two-d-url.mjs';

test('resolves localhost desktop URLs to the Structurizr viewer on port 9090', () => {
  assert.equal(
    resolveTwoDUrl('http://localhost:3000/'),
    'http://localhost:9090/workspace/decisions'
  );
});

test('resolves GitHub Codespaces forwarded URLs to the matching 9090 port', () => {
  assert.equal(
    resolveTwoDUrl('https://friendly-3000.app.github.dev/'),
    'https://friendly-9090.app.github.dev/workspace/decisions'
  );
});

test('falls back to the local Structurizr viewer when the environment is unknown', () => {
  assert.equal(
    resolveTwoDUrl('https://example.com/'),
    'http://localhost:9090/workspace/decisions'
  );
});
