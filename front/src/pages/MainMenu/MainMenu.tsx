import { Button, Typography } from '@airbus/components-react';
import './mainmenu.css';
import { Image } from '@mui/icons-material';

function MainMenu() {
  return (
    <div className="mainMenuContainer">
      <div className="titleContainer">
        <Typography variant="h2">Innovation Industrial DB Visualization</Typography>
        <img src="/images/logos/AIRBUS_Blue.png" className="logo" />
      </div>
      <div className="buttonsContainer">
        <Button className="button road">Technology Roadmapping</Button>
        <Button className="button database">Industrial DataBase Mapping</Button>
        <Button className="button project">Project Roadmapping</Button>
      </div>
    </div>
  );
};

export default MainMenu;
