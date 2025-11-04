import { AppHeader, useAuth } from '@df/utils';
import { Outlet } from 'react-router-dom';
import { routeConfig } from '../router/routeConfig';
import { Header, Tab, Tabs } from '@airbus/components-react';
import { useTranslation } from 'react-i18next';

function AppLayout() {
  const { status } = useAuth();
  const { t } = useTranslation('login');

  return (
    <div>
      <header>
        <AppHeader
          structure={routeConfig}
          appName={t('template')}
          info={{ text: 'hola', handleInfoClick: null }}
          notifications={{ notificationCount: 0, handleNotificationsClick: null }}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
