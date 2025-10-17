import { useState } from 'react';

import { Form, Heading, Text, TextField, View } from '@toolbox/design-system';

import greet from '../src/main';

import PageWithTheme from './components/PageWithTheme';

function App() {
  const [whoToGreet, setWhoToGreet] = useState('world');

  return (
    <PageWithTheme>
      <Heading level={1}>Salesforce</Heading>
      <Form>
        <TextField
          width="size-3000"
          label="Who to greet"
          value={whoToGreet}
          onChange={setWhoToGreet}
          isRequired
        />
        <View marginTop="size-400">
          <Text>{greet(whoToGreet)}</Text>
        </View>
      </Form>
    </PageWithTheme>
  );
}

export default App;
