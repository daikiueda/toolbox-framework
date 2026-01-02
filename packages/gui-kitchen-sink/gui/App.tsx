import React from 'react';

import { Heading, Text, Toast, View, useSetting } from '@toolbox/design-system';
import { iconStyle, style } from '@toolbox/design-system/style' with { type: 'macro' };

import { Setting } from './Setting';
import DocumentUpload from './components/DocumentUpload';
import ProjectActions from './components/ProjectActions';
import ProjectConfiguration from './components/ProjectConfiguration';
import TeamRoster from './components/TeamRoster';
import ViewPreferences from './components/ViewPreferences';
import SettingsDialog from './components/dialogs/SettingsDialog';
import PageWithTheme from './components/theme/PageWithTheme';
import { BetaApp as AppIcon } from './components/theme/icons';

const App: React.FC = () => {
  const [setting, updateSetting] = useSetting(Setting.default(), {
    persistence: Setting.persistence,
  });
  const {
    projectName,
    selectedFramework,
    memberCount,
    selectedPlan,
    isPublished,
    activeLayout,
    sortMemberDescriptor,
  } = setting;

  const handleResetSettings = React.useCallback(() => {
    updateSetting(Setting.default());
    Toast.positive('Settings were reset to defaults.');
  }, [updateSetting]);

  return (
    <PageWithTheme>
      <div
        className={style({
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        })}
      >
        <div className={style({ display: 'flex', alignItems: 'center', gap: 8 })}>
          <AppIcon styles={iconStyle({ size: 'XL' })} />
          <Heading level={1}>Design System Kitchen Sink</Heading>
        </div>
        <SettingsDialog onReset={handleResetSettings} />
      </div>
      <View marginTop="size-150">
        <Text>Explore the entire component palette at a glance.</Text>
      </View>

      <ProjectActions activeLayout={activeLayout} />
      <ProjectConfiguration
        projectName={projectName}
        memberCount={memberCount}
        selectedFramework={selectedFramework}
        selectedPlan={selectedPlan}
        isPublished={isPublished}
        updateSetting={updateSetting}
      />
      <ViewPreferences activeLayout={activeLayout} updateSetting={updateSetting} />
      <TeamRoster sortMemberDescriptor={sortMemberDescriptor} updateSetting={updateSetting} />
      <DocumentUpload />
    </PageWithTheme>
  );
};

export default App;
export { AppIcon };
