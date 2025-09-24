import { Header } from '@airbus/components-react';
import { useLocation, useNavigate } from 'react-router-dom';

function AdminPage() {
  const navigate = useNavigate();
  const location = useLocation();
  return (
    <div>
      <Header title={'admin'} appName={'que tal'} />
    </div>
  );
}

export default AdminPage;
