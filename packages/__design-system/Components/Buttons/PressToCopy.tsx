import React from 'react';

import Toast from '../../GlobalUI/Toast';
import useClipboard from '../../hooks/useClipboard';
import { style } from '../../style' with { type: 'macro' };
import { Text } from '../Content';
import { Tooltip, TooltipTrigger } from '../Overlays';

import { ActionButton } from './index';

type Props = Omit<React.ComponentProps<typeof ActionButton>, 'onPress' | 'isQuiet'>;

const copy = async (writeText: (arg0: string) => Promise<void>, content: string | number) => {
  try {
    await writeText(String(content));
    Toast.positive(`"${String(content)}" をコピーしました`, { timeout: 100 });
  } catch (e) {
    if (e instanceof Error) {
      Toast.negative(e.message);
    } else {
      console.error(e);
    }
  }
};

const PressToCopy: React.FC<Props> = ({ children, ...props }) => {
  const [pressed, setPressed] = React.useState(false);

  const { writeText } = useClipboard();
  const onPress = React.useCallback(async () => {
    await copy(writeText, String(children));
    setPressed(true);
  }, [writeText, children]);

  return (
    <span className={style({ display: 'inline-block' })}>
      <TooltipTrigger isDisabled={pressed}>
        <ActionButton isQuiet onPress={onPress} {...props}>
          <Text styles={style({ color: 'neutral-subdued', fontWeight: 'normal' })}>{children}</Text>
        </ActionButton>
        <Tooltip>クリックしてコピー</Tooltip>
      </TooltipTrigger>
    </span>
  );
};

export default PressToCopy;
