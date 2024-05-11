import cli, { Examples, Executor, Options } from '@toolbox/cli';

import main from './main';

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
  const who = stdin || argv._[0] || argv.who;
  if (!who) {
    yargs.showHelp();
    return;
  }
  console.log(main(who));
};

export default cli(
  {
    options,
    examples,
  },
  executor
);
