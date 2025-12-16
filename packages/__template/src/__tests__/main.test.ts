import assert from 'node:assert';
import { describe, it } from 'node:test';

import template from '../main';

describe('template', () => {
  it('returns "hello world!"', () => {
    assert.equal(template('world'), 'hello world!');
  });
});
