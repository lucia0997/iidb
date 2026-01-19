import { AppHeader, useAuth } from '@df/utils';
import { Outlet } from 'react-router-dom';
import { routeConfig } from '../router/routeConfig';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

function AppLayout() {
  const { status } = useAuth();
  const { t, i18n } = useTranslation('login')

    const languages = [
    { value: 'en', label: 'English', icon: 'gb' },
    { value: 'es', label: 'Español', icon: 'es' },
    { value: 'fr', label: 'Français', icon: 'fr' },
    { value: 'de', label: 'Deutsch', icon: 'de' },
  ];
  return (
    <div>
      <header>
        <AppHeader
          structure={routeConfig}
          appName={t('template')}
          info={{ text: 'hola', handleInfoClick: null }}
          notifications={{ notificationCount: 0, handleNotificationsClick: null }}
           languages={languages}
          showLangSelect
          logoutText={t('logout')}
          selectedLanguage={i18n.language || 'en'}
          onChangeLanguage={(lang) => i18n.changeLanguage(lang)}
          // renderAvatarMenu={({ user, close }) => (
          //   <>
          //     <MenuItem>root 1</MenuItem>
          //   </>
          // )}
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
