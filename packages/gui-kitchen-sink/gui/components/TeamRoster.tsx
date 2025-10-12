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
      icon={<Icon.Data size="M" />}
      title="Team Roster"
      description="View and manage team members."
    >
      <TableView
        aria-label="Team roster"
        sortDescriptor={sortMemberDescriptor}
        onSortChange={updateSetting('sortMemberDescriptor')}
        width="100%"
      >
        <TableHeader>
          <Column key="name" allowsSorting>
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
              <Cell>{`${member.experience} yrs`}</Cell>
            </Row>
          ))}
        </TableBody>
      </TableView>
    </Section>
  );
};

export default TeamRoster;
