import { Typography } from '@airbus/components-react';
import './mainmenu.css';
import { Link } from 'react-router-dom';
import { FC } from 'react';

const MainMenu: FC = () => {
  return (
    <div className="mainMenuContainer">
      <div className="titleContainer">
        <Typography variant="h2">Innovation Industrial DB Visualization</Typography>
        <img src="/images/logos/AIRBUS_Blue.png" className="logo" />
      </div>
      <div className="buttonsContainer">
        <Link to="/tecnology-roadmappping" className="button road">
          Technology Roadmapping
        </Link>
        <Link to="industrial-database" className="button database">
          Industrial DataBase Mapping
        </Link>
        <Link to="project-roadmapping" className="button project">
          Project Roadmapping
        </Link>
      </div>
    </div>
  );
}

export default MainMenu;
