import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { style } from '../../style' with { type: 'macro' };
import { Text } from '../Content';

import * as Space from './Space';

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
              className={style({ backgroundColor: 'gray-100', height: 8, borderRadius: 'sm' })}
              style={{ width: Space.OneLine }}
            />
            <Text>
              <code>OneLine</code>: {Space.OneLine} (28px) - Line height spacing
            </Text>
          </div>

          <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
            <div
              className={style({ backgroundColor: 'gray-100', height: 8, borderRadius: 'sm' })}
              style={{ width: Space.OneLetter }}
            />
            <Text>
              <code>OneLetter</code>: {Space.OneLetter} (14px) - Letter spacing
            </Text>
          </div>

          <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
            <div
              className={style({ backgroundColor: 'gray-100', height: 8, borderRadius: 'sm' })}
              style={{ width: Space.Closest }}
            />
            <Text>
              <code>Closest</code>: {Space.Closest} (4px) - Minimal spacing
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
            <div className={style({ display: 'flex', marginTop: 28 })}>
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
            <div className={style({ display: 'flex', marginTop: 12 })}>
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
            <div className={style({ display: 'flex', marginTop: 4 })}>
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

export const TypicalUsage: StoryObj = {
  render: () => (
    <div className={style({ padding: 16 })}>
      <Text>
        <strong>Typical Usage Examples</strong>
      </Text>
      <div style={{ paddingTop: Space.OneLine }}>
        <div className={style({ display: 'flex', flexDirection: 'column', gap: 28 })}>
          <div>
            <Text>
              <strong>Card with OneLine spacing:</strong>
            </Text>
            <div
              className={style({
                backgroundColor: 'gray-50',
                borderRadius: 'default',
                borderWidth: 1,
              })}
              style={{ padding: Space.OneLine, marginTop: Space.OneLetter }}
            >
              <Text>This card uses OneLine for internal padding</Text>
              <div style={{ paddingTop: Space.OneLetter }}>
                <Text>And OneLetter for text spacing</Text>
              </div>
            </div>
          </div>

          <div>
            <Text>
              <strong>Tight layout with Closest spacing:</strong>
            </Text>
            <div className={style({ display: 'flex', marginTop: 12, gap: 4 })}>
              <div
                style={{
                  backgroundColor: 'var(--spectrum-blue-400)',
                  padding: Space.Closest,
                  borderRadius: '4px',
                }}
              >
                <Text>Tag 1</Text>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--spectrum-green-400)',
                  padding: Space.Closest,
                  borderRadius: '4px',
                }}
              >
                <Text>Tag 2</Text>
              </div>
              <div
                style={{
                  backgroundColor: 'var(--spectrum-red-400)',
                  padding: Space.Closest,
                  borderRadius: '4px',
                }}
              >
                <Text>Tag 3</Text>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
};
