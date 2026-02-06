import { Typography } from '@airbus/components-react';
import './mainmenu.css';
import { Link } from 'react-router-dom';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

const MainMenu: FC = () => {
  const { t } = useTranslation('main_menu');

  return (
    <div className="mainMenuContainer">
      <div className="titleContainer">
        <Typography variant="h2">{t('appTitle')}</Typography>
        <img src="/images/logos/AIRBUS_Blue.png" className="logo" />
      </div>
      <div className="buttonsContainer">
        <Link to="/technology-roadmappping" className="button road">
          {t('technologyRoadmapping')}
        </Link>
        <Link to="industrial-database" className="button database">
          {t('industrialDatabaseMapping')}
        </Link>
        <Link to="project-roadmapping" className="button project">
          {t('projectRoadmapping')}
        </Link>
        <Link to="create-database" className="button create">
          {t('industrialDatabaseOperations')}
        </Link>
      </div>
    </div>
  );
}

export default MainMenu;
