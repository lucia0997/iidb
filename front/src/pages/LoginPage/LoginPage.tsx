import { Header } from '@airbus/components-react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginForm from './LoginForm';
import './login.css';
import '../../main.css';

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  return (
    <>
      <Header title={'Template'} appName={'Template'} />
      <div className="blueBackground fullscreen centeredFlex">
        <div className="loginContainer centeredFlex roundedCorners">
          <div className="loginLogoContainer">
            <img className="loginLogo" src="/images/logos/AIRBUS_Blue.png" alt="airbusbluelogo" />
          </div>
          <LoginForm
            onSuccess={() => {
              console.log('entro');
              navigate(from);
            }}
          />
        </div>
      </div>
    </>
  );
}

export default LoginPage;
