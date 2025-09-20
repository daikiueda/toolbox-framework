import * as fs from 'fs/promises';
import * as path from 'path';
import { text } from 'stream/consumers';
import yargs, { ArgumentsCamelCase, Options as YargsOptions } from 'yargs';
import { hideBin } from 'yargs/helpers';

type Argv<T extends object> = ArgumentsCamelCase<T>;

export type Options<Flags extends object> = {
  [key in keyof Flags]: YargsOptions;
};

export type Examples = [string, (string | undefined)?][];

export type Executor<T extends object> = (arg0: {
  argv: Argv<T>;
  stdin: string | null;
  yargs: ReturnType<typeof yargs>;
}) => Promise<void> | void;

const getStdin = async () => {
  if (process.stdin.isTTY) {
    return null;
  }

  return text(process.stdin);
};

const cli =
  <T extends object>(
    {
      options,
      examples,
    }: {
      options?: { [key in keyof T]: YargsOptions };
      examples?: Examples;
    },
    exec: Executor<T>
  ) =>
  async () => {
    let _yargs = yargs(hideBin(process.argv));

    if (options) {
      _yargs = Object.entries(options).reduce(
        (acc, [key, option]) => acc.option(key, option as YargsOptions),
        _yargs
      );
    }

    if (examples) {
      _yargs = _yargs.example(examples);
    }

    const parsed = (await _yargs.parseAsync()) as Argv<T>;

    await exec({
      argv: parsed,
      stdin: await getStdin(),
      yargs: _yargs,
    });
  };
export default cli;

export const basename = (pathToFile: string) => path.basename(pathToFile);

export const readFile = (pathToFile: string) =>
  fs.readFile(path.resolve(pathToFile), { encoding: 'utf-8' });

export const writeFile = (pathToFile: string, content: string) =>
  fs.writeFile(path.resolve(pathToFile), content);
