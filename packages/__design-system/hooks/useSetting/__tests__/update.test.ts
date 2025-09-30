import test from 'node:test';

import assert from 'node:assert/strict';

import type { Dispatch, SetStateAction } from 'react';

import { createUpdateSetting } from '../update';

type SampleSetting = {
  title: string;
  count: number;
  active: boolean;
};

const createStore = (initial: SampleSetting) => {
  let state = initial;

  const setState: Dispatch<SetStateAction<SampleSetting>> = (next) => {
    state =
      typeof next === 'function' ? (next as (prev: SampleSetting) => SampleSetting)(state) : next;
  };

  return {
    getState: () => state,
    updateSetting: createUpdateSetting(setState),
  };
};

test('updates a field with typed updater', () => {
  const store = createStore({ title: 'initial', count: 0, active: false });

  store.updateSetting('title')('updated');

  assert.equal(store.getState().title, 'updated');
  assert.equal(store.getState().count, 0);
});

test('guards invalid values when a guard is provided', () => {
  const store = createStore({ title: 'initial', count: 1, active: false });

  const guard = (value: unknown): value is number => typeof value === 'number';

  store.updateSetting('count', guard)('not-a-number' as unknown);

  assert.equal(store.getState().count, 1);
});

test('applies partial object updates', () => {
  const store = createStore({ title: 'initial', count: 2, active: false });

  store.updateSetting({ title: 'partial', active: true });

  assert.deepEqual(store.getState(), { title: 'partial', count: 2, active: true });
});

test('applies functional updates', () => {
  const store = createStore({ title: 'initial', count: 3, active: false });

  store.updateSetting((prev) => ({ ...prev, count: prev.count + 1 }));

  assert.equal(store.getState().count, 4);
  assert.equal(store.getState().title, 'initial');
});
