import type { DirectoryDropItem, DropEvent, DropItem, FileDropItem } from '@react-types/shared';

const DEFAULT_READ_MODE = 'text' as const;

export type DropZoneReadMode = 'text' | 'arrayBuffer';

// NOTE: interface として定義することで、将来の型拡張（interface merging）に柔軟に対応できる
export interface DropZoneReadOptions {
  readAs?: DropZoneReadMode;
}

// NOTE: 同上の理由で interface を採用し、利用側がフィールドを追加しやすいようにしている
export interface DropZoneFileContent {
  path: string;
  file: File;
  content: string | ArrayBuffer;
  readAs: DropZoneReadMode;
}

/**
 * DropEvent 全体を受け取るショートカット。
 * 内部で DropItem 配列を抽出して読み出す処理へ委譲する。
 */
export function readFileContentFromDropEvent(
  event: Pick<DropEvent, 'items'>,
  options?: DropZoneReadOptions
): Promise<DropZoneFileContent[]> {
  return readFileContentFromDropItems(event.items, options);
}

/**
 * DropItem 配列を直接処理する本体関数。
 * ファイルとディレクトリを再帰的に展開し、指定フォーマットで内容を取得する。
 */
export async function readFileContentFromDropItems(
  items: DropItem[],
  options: DropZoneReadOptions = {}
): Promise<DropZoneFileContent[]> {
  const mode = options.readAs ?? DEFAULT_READ_MODE;
  const results: DropZoneFileContent[] = [];

  for (const item of items) {
    const contents = await collectContentFromDropItem(item, '', mode);
    results.push(...contents);
  }

  return results;
}

/**
 * FileTrigger などが返す FileList を処理するヘルパー。
 * DropItem を経由せずにファイル内容へアクセスする。
 */
export async function readFileContentFromFileList(
  fileList: FileList | Iterable<File>,
  options: DropZoneReadOptions = {}
): Promise<DropZoneFileContent[]> {
  const mode = options.readAs ?? DEFAULT_READ_MODE;
  const files = Array.from(fileList);
  return Promise.all(
    files.map(async (file) => {
      const path = getRelativePath(file);
      const content = await readFileData(file, mode);
      return {
        path,
        file,
        content,
        readAs: mode,
      } satisfies DropZoneFileContent;
    })
  );
}

async function collectContentFromDropItem(
  item: DropItem,
  parentPath: string,
  mode: DropZoneReadMode
): Promise<DropZoneFileContent[]> {
  switch (item.kind) {
    case 'file':
      return [await createContentFromFileDropItem(item, parentPath, mode)];

    case 'directory':
      return collectContentFromDirectory(item, parentPath, mode);

    case 'text':
    default:
      return [];
  }
}

async function collectContentFromDirectory(
  directory: DirectoryDropItem,
  parentPath: string,
  mode: DropZoneReadMode
): Promise<DropZoneFileContent[]> {
  const directoryPath = joinPath(parentPath, directory.name);
  const results: DropZoneFileContent[] = [];

  for await (const entry of directory.getEntries()) {
    const contents = await collectContentFromDropItem(entry, directoryPath, mode);
    results.push(...contents);
  }

  return results;
}

async function createContentFromFileDropItem(
  item: FileDropItem,
  parentPath: string,
  mode: DropZoneReadMode
): Promise<DropZoneFileContent> {
  const file = await item.getFile();
  const path = joinPath(parentPath, file.name || item.name);
  const content = await readFileData(file, mode);

  return {
    path,
    file,
    content,
    readAs: mode,
  } satisfies DropZoneFileContent;
}

function joinPath(parent: string, name: string): string {
  return parent ? `${parent}/${name}` : name;
}

function getRelativePath(file: File): string {
  const maybeRelativePath = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
  return maybeRelativePath && maybeRelativePath.length > 0 ? maybeRelativePath : file.name;
}

async function readFileData(file: File, mode: DropZoneReadMode): Promise<string | ArrayBuffer> {
  if (mode === 'arrayBuffer') {
    return file.arrayBuffer();
  }

  return file.text();
}
