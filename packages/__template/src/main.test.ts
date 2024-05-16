import assert from 'node:assert';
import { describe, it } from 'node:test';

import main from './main';

describe('main', () => {
  it('returns "Hello World!"', () => {
    assert.equal(main('world'), 'hello world!');
  });
});
