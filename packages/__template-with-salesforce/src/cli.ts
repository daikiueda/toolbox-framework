import cli, { type Examples, type Executor, type Options } from '@toolbox/cli';
import { SalesforceConnection, getSfdxSession } from '@toolbox/salesforce/lib';

import { getOrgDetail } from './repositories/OrgDetailRepository';

type Flags = {
  targetOrg: string;
};

const options: Options<Flags> = {
  targetOrg: {
    alias: 'o',
    type: 'string',
    description: 'ユーザー名または組織のエイリアス',
  },
};

const examples: Examples = [
  ['$0 my-org-alias'],
  ['$0 -o my-org-alias'],
  ['echo "my-org-alias" | $0'],
];

const executor: Executor<Flags> = async ({ argv, stdin, yargs }) => {
  const fallbackArg = argv._[0];
  const org =
    stdin ?? (typeof fallbackArg === 'string' ? fallbackArg : undefined) ?? argv.targetOrg;

  if (!org) {
    yargs.showHelp();
    return;
  }

  try {
    const session = await getSfdxSession(org);
    await SalesforceConnection.getInstance().connect({
      instance_url: session.instanceUrl,
      access_token: session.accessToken,
    });

    const detail = await getOrgDetail();
    console.log(JSON.stringify(detail, null, 2));
  } catch (error) {
    console.error('[template-with-salesforce] OrgDetail 取得エラー:', error);
    process.exitCode = 1;
  }
};

export default cli(
  {
    options,
    examples,
  },
  executor
);
