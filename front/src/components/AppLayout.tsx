import { AppHeader, useAuth } from '@df/utils';
import { Outlet } from 'react-router-dom';
import { routeConfig } from '../router/routeConfig';
import { MenuItem } from '@mui/material';
import { useTranslation } from 'react-i18next';

// Altura fija del header en rem (medida real del AppHeader)
const HEADER_HEIGHT_REM = 4;

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
    <div
      style={{
        minHeight: '100vh',
        paddingTop: `${HEADER_HEIGHT_REM}rem`,
      }}
    >
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1100,
          height: `${HEADER_HEIGHT_REM}rem`,
        }}
      >
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
      <main
        style={{
          height: `calc(100vh - ${HEADER_HEIGHT_REM}rem)`,
          overflow: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
