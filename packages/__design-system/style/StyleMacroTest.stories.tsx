import { Meta, StoryObj } from '@storybook/react-vite';

import React from 'react';

import { style } from '@toolbox/design-system/style' with { type: 'macro' };

/**
 * スタイルマクロの動作確認用ストーリー
 */
const StyleMacroTest = () => {
  return (
    <div
      className={style({
        backgroundColor: 'gray-100',
        padding: 16,
        borderRadius: 'lg',
      })}
    >
      <p
        className={style({
          color: 'gray-800',
          fontSize: 'body-lg',
        })}
      >
        Style macro is working!
      </p>
    </div>
  );
};

const meta: Meta<typeof StyleMacroTest> = {
  title: 'Style/StyleMacroTest',
  component: StyleMacroTest,
  tags: ['autodocs'],
};

export default meta;

export const Basic: StoryObj<typeof StyleMacroTest> = {};
