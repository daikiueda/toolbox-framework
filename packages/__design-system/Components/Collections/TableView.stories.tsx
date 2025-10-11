import { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';

import React from 'react';

import type { SortDescriptor } from '@react-types/shared';

import { ActionButton, View } from '../../index';

import { Cell, Column, Row, TableBody, TableHeader, TableView, TableViewUtil } from './index';

type Character = {
  id: number;
  name: string;
  height: string;
  mass: string;
  birth_year: string;
};

const characters: Character[] = [
  { id: 1, name: 'Luke Skywalker', height: '172', mass: '77', birth_year: '19BBY' },
  { id: 2, name: 'C-3PO', height: '167', mass: '75', birth_year: '112BBY' },
  { id: 3, name: 'R2-D2', height: '96', mass: '32', birth_year: '33BBY' },
  { id: 4, name: 'Darth Vader', height: '202', mass: '136', birth_year: '41.9BBY' },
  { id: 5, name: 'Leia Organa', height: '150', mass: '49', birth_year: '19BBY' },
];

/**
 * https://react-spectrum.adobe.com/react-spectrum/TableView.html
 */
const meta: Meta<typeof TableView> = {
  title: 'Components/Collections/TableView',
  component: TableView,
  tags: ['autodocs'],
  argTypes: {
    selectionMode: { control: 'inline-radio', options: ['none', 'single', 'multiple'] },
    isQuiet: { control: 'boolean' },
    density: { control: 'inline-radio', options: ['compact', 'regular', 'spacious'] },
  },
  args: {
    'aria-label': 'Example table',
    selectionMode: 'multiple',
    onSelectionChange: fn(),
  },
};
export default meta;

const Stage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <View paddingX="single-line-width" paddingY="single-line-height">
    {children}
  </View>
);

export const Basic: StoryObj<typeof TableView> = {
  render: (args) => (
    <Stage>
      <TableView {...args}>
        <TableHeader>
          <Column key="name">Name</Column>
          <Column key="height">Height</Column>
          <Column key="mass">Mass</Column>
          <Column key="birth_year">Birth Year</Column>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <Row key={character.id}>
              <Cell>{character.name}</Cell>
              <Cell>{character.height}</Cell>
              <Cell>{character.mass}</Cell>
              <Cell>{character.birth_year}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Stage>
  ),
};

export const WithSorting: StoryObj<typeof TableView> = {
  render: (args) => {
    const { sortDescriptor, onSortChange } = TableViewUtil.usePropsToSort({
      column: 'name',
      direction: 'ascending',
    });

    const sortedItems = TableViewUtil.toSorted({
      items: characters,
      sortDescriptor,
    });

    return (
      <Stage>
        {' '}
        <TableView
          {...args}
          sortDescriptor={sortDescriptor as SortDescriptor}
          onSortChange={onSortChange}
        >
          <TableHeader>
            <Column key="name" allowsSorting>
              Name
            </Column>
            <Column key="height" allowsSorting>
              Height
            </Column>
            <Column key="mass" allowsSorting>
              Mass
            </Column>
            <Column key="birth_year">Birth Year</Column>
          </TableHeader>
          <TableBody>
            {sortedItems.map((character) => (
              <Row key={character.id}>
                <Cell>{character.name}</Cell>
                <Cell>{character.height}</Cell>
                <Cell>{character.mass}</Cell>
                <Cell>{character.birth_year}</Cell>
              </Row>
            ))}
          </TableBody>
        </TableView>
      </Stage>
    );
  },
};

export const WithActions: StoryObj<typeof TableView> = {
  render: (args) => (
    <Stage>
      {' '}
      <TableView {...args}>
        <TableHeader>
          <Column key="name">Name</Column>
          <Column key="height">Height</Column>
          <Column key="actions">Actions</Column>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <Row key={character.id}>
              <Cell>{character.name}</Cell>
              <Cell>{character.height}</Cell>
              <Cell>
                <ActionButton isQuiet onPress={() => alert(`Edit ${character.name}`)}>
                  Edit
                </ActionButton>
              </Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Stage>
  ),
};

export const SingleSelection: StoryObj<typeof TableView> = {
  args: {
    selectionMode: 'single',
  },
  render: (args) => (
    <Stage>
      <TableView {...args}>
        <TableHeader>
          <Column key="name">Name</Column>
          <Column key="height">Height</Column>
          <Column key="mass">Mass</Column>
        </TableHeader>
        <TableBody>
          {characters.slice(0, 3).map((character) => (
            <Row key={character.id}>
              <Cell>{character.name}</Cell>
              <Cell>{character.height}</Cell>
              <Cell>{character.mass}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Stage>
  ),
};

export const Compact: StoryObj<typeof TableView> = {
  args: {
    density: 'compact',
    selectionMode: 'none',
  },
  render: (args) => (
    <Stage>
      {' '}
      <TableView {...args}>
        <TableHeader>
          <Column key="name">Name</Column>
          <Column key="height">Height</Column>
          <Column key="mass">Mass</Column>
          <Column key="birth_year">Birth Year</Column>
        </TableHeader>
        <TableBody>
          {characters.map((character) => (
            <Row key={character.id}>
              <Cell>{character.name}</Cell>
              <Cell>{character.height}</Cell>
              <Cell>{character.mass}</Cell>
              <Cell>{character.birth_year}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Stage>
  ),
};
