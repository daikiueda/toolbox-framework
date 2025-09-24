import { useCallback } from 'react';

import type { DropEvent } from '@react-types/shared';

import type { DropZoneFileContent, DropZoneReadOptions } from './logics';
import { readFileContentFromDropEvent, readFileContentFromFileList } from './logics';

export type { DropZoneFileContent } from './logics';

export interface UseFileSelectionHandlers {
  handleDrop: (event: Pick<DropEvent, 'items'>) => Promise<void>;
  handleSelect: (fileList: FileList | null) => Promise<void>;
}

export interface UseFileSelectionOptions extends DropZoneReadOptions {}

/**
 * DropZone と FileTrigger の選択結果を共通処理に橋渡しするカスタムフック。
 */
export default function useFileSelection(
  onFiles: (files: DropZoneFileContent[]) => void,
  options: UseFileSelectionOptions = {}
): UseFileSelectionHandlers {
  const readAs = options.readAs;

  const handleDrop = useCallback<UseFileSelectionHandlers['handleDrop']>(
    async (event) => {
      const readOptions = typeof readAs === 'undefined' ? undefined : { readAs };
      const files = await readFileContentFromDropEvent(event, readOptions);
      onFiles(files);
    },
    [onFiles, readAs]
  );

  const handleSelect = useCallback<UseFileSelectionHandlers['handleSelect']>(
    async (fileList) => {
      if (!fileList) {
        return;
      }

      const readOptions = typeof readAs === 'undefined' ? undefined : { readAs };
      const files = await readFileContentFromFileList(fileList, readOptions);
      onFiles(files);
    },
    [onFiles, readAs]
  );

  return {
    handleDrop,
    handleSelect,
  };
}
