import { useState } from 'react';

import { Heading, Text } from '@toolbox/design-system/Components/Content';
import { Form, TextField } from '@toolbox/design-system/Components/Forms';
import { Page, View } from '@toolbox/design-system/Components/Layout';

import greet from '../src/main';

function App() {
  const [whoToGreet, setWhoToGreet] = useState('world');

  return (
    <Page>
      <Heading level={1}>Example</Heading>
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
    </Page>
  );
}

export default App;
