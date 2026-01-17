import React from 'react';

import {
  Cell,
  Column,
  Row,
  SortDescriptor,
  TableBody,
  TableHeader,
  TableView,
  TableViewUtil,
} from '@toolbox/design-system';
import { iconStyle } from '@toolbox/design-system/style' with { type: 'macro' };

import { SAMPLE_MEMBERS } from '../sample-data/members';

import Section from './layout/Section';
import * as Icon from './theme/icons';

type TeamRosterProps = {
  sortMemberDescriptor: SortDescriptor;
  updateSetting: (key: 'sortMemberDescriptor') => (value: SortDescriptor) => void;
};

const TeamRoster: React.FC<TeamRosterProps> = ({ sortMemberDescriptor, updateSetting }) => {
  const [members] = React.useState(SAMPLE_MEMBERS);

  const sortedMembers = React.useMemo(
    () =>
      TableViewUtil.toSorted({
        items: members,
        sortDescriptor: sortMemberDescriptor,
      }),
    [sortMemberDescriptor]
  );

  return (
    <Section
      icon={<Icon.Data styles={iconStyle({ size: 'XL' })} />}
      title="Team Roster"
      description="View and manage team members."
    >
      <TableView
        selectionMode="multiple"
        aria-label="Team roster"
        sortDescriptor={sortMemberDescriptor}
        onSortChange={updateSetting('sortMemberDescriptor')}
      >
        <TableHeader>
          <Column key="name" allowsSorting isRowHeader>
            Name
          </Column>
          <Column key="role" allowsSorting>
            Role
          </Column>
          <Column key="experience" allowsSorting>
            Experience
          </Column>
        </TableHeader>
        <TableBody>
          {sortedMembers.map((member) => (
            <Row key={member.id}>
              <Cell>{member.name}</Cell>
              <Cell>{member.role}</Cell>
              <Cell align="end">{`${member.experience} yrs`}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Section>
  );
};

export default TeamRoster;
