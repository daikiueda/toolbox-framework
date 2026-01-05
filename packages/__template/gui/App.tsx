import { useState } from 'react';

import { Form, Heading, Text, TextField } from '@toolbox/design-system';
import { style } from '@toolbox/design-system/style' with { type: 'macro' };

import template from '../src/main';

import PageWithTheme from './components/PageWithTheme';

function Template() {
  const [whoToGreet, setWhoToGreet] = useState('world');

  return (
    <PageWithTheme>
      <Heading level={1}>Template</Heading>
      <Form>
        <TextField
          styles={style({ width: 240 })}
          label="Who to greet"
          value={whoToGreet}
          onChange={setWhoToGreet}
          isRequired
        />
        <div className={style({ marginTop: 32 })}>
          <Text>{template(whoToGreet)}</Text>
        </div>
      </Form>
    </PageWithTheme>
  );
}

export default Template;
