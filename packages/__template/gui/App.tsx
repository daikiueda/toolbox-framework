import { useState } from 'react';

import { Form, Heading, Text, TextField, View } from '@toolbox/design-system';

import template from '../src/main';

import PageWithTheme from './components/PageWithTheme';

function Template() {
  const [whoToGreet, setWhoToGreet] = useState('world');

  return (
    <PageWithTheme>
      <Heading level={1}>Template</Heading>
      <Form>
        <TextField
          width="size-3000"
          label="Who to greet"
          value={whoToGreet}
          onChange={setWhoToGreet}
          isRequired
        />
        <View marginTop="size-400">
          <Text>{template(whoToGreet)}</Text>
        </View>
      </Form>
    </PageWithTheme>
  );
}

export default Template;
