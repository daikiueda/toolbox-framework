import cli, { Examples, Executor, Options } from '@toolbox/cli';

import template from './main';

type Flags = {
  who: string;
};

const options: Options<Flags> = {
  who: {
    alias: 'w',
    type: 'string',
    description: 'Who to greet',
  },
};

const examples: Examples = [['$0 world'], ['$0 -w world'], ['echo "world" | $0 > ./result.txt']];

const executor: Executor<Flags> = ({ argv, stdin, yargs }) => {
  const fallbackArg = argv._[0];
  const who = stdin ?? (typeof fallbackArg === 'string' ? fallbackArg : undefined) ?? argv.who;

  if (!who) {
    yargs.showHelp();
    return;
  }

  console.log(template(who));
};

export default cli(
  {
    options,
    examples,
  },
  executor
);
