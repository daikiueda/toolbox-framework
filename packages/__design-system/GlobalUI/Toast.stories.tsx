import { Meta, StoryFn } from '@storybook/react-vite';

import { Button } from '../Components/Buttons';

import Toast, { ToastContainer } from './Toast';

/**
 * https://react-spectrum.adobe.com/react-spectrum/Toast.html
 *
 * ```TypeScript
 * import { Toast } from '@toolbox/design-system';
 *
 * () => Toast.positive('Toast is done!', {timeout: 5000});
 * ```
 */
const meta: Meta = {
  title: 'Global UI/Toast',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
};
export default meta;

export const Basic: StoryFn = () => {
  return (
    <Button onPress={() => Toast.positive('Toast is done!')} variant="primary">
      Show toast
    </Button>
  );
};
