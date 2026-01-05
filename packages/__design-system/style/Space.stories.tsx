import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { Text } from '../Components/Content';

import { space, style } from './index' with { type: 'macro' };

/**
 * Space utility constants for consistent spacing throughout the application.
 * Based on Adobe Spectrum's dimension values system.
 */
const meta: Meta = {
  title: 'Components/Layout/Space',
  tags: ['autodocs'],
};
export default meta;

export const SpaceConstants: StoryObj = {
  render: () => (
    <div className={style({ padding: 16 })}>
      <Text>
        <strong>Space Constants Reference</strong>
      </Text>
      <div className={style({ paddingTop: 16 })}>
        <div className={style({ display: 'flex', flexDirection: 'column', gap: 12 })}>
          <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
            <div
              className={style({
                backgroundColor: 'gray-100',
                height: 8,
                borderRadius: 'sm',
                width: space('OneLine'),
              })}
            />
            <Text>
              <code>OneLine</code>: {space('OneLine')} (28px) - Line height spacing
            </Text>
          </div>

          <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
            <div
              className={style({
                backgroundColor: 'gray-100',
                height: 8,
                borderRadius: 'sm',
                width: space('OneLetter'),
              })}
            />
            <Text>
              <code>OneLetter</code>: {space('OneLetter')} (16px) - Letter spacing
            </Text>
          </div>

          <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
            <div
              className={style({
                backgroundColor: 'gray-100',
                height: 8,
                borderRadius: 'sm',
                width: space('Closest'),
              })}
            />
            <Text>
              <code>Closest</code>: {space('Closest')} (4px) - Minimal spacing
            </Text>
          </div>
        </div>
      </div>
    </div>
  ),
};

export const SpacingComparison: StoryObj = {
  render: () => (
    <div className={style({ padding: 16 })}>
      <Text>
        <strong>Spacing Comparison</strong>
      </Text>
      <div className={style({ paddingTop: 16 })}>
        <div className={style({ display: 'flex', flexDirection: 'column', gap: 16 })}>
          <div>
            <Text>OneLine spacing between elements:</Text>
            <div className={style({ display: 'flex', marginTop: 28, gap: space('OneLine') })}>
              <div
                className={style({ backgroundColor: 'blue-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 1</Text>
              </div>
              <div
                className={style({ backgroundColor: 'green-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 2</Text>
              </div>
            </div>
          </div>

          <div>
            <Text>OneLetter spacing between elements:</Text>
            <div className={style({ display: 'flex', marginTop: 12, gap: space('OneLetter') })}>
              <div
                className={style({ backgroundColor: 'blue-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 1</Text>
              </div>
              <div
                className={style({ backgroundColor: 'green-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 2</Text>
              </div>
            </div>
          </div>

          <div>
            <Text>Closest spacing between elements:</Text>
            <div className={style({ display: 'flex', marginTop: 4, gap: space('Closest') })}>
              <div
                className={style({ backgroundColor: 'blue-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 1</Text>
              </div>
              <div
                className={style({ backgroundColor: 'green-400', padding: 8, borderRadius: 'sm' })}
              >
                <Text>Element 2</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
