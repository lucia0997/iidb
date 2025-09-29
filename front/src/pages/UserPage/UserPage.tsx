import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Divider,
  Header,
  Tabs,
  Typography,
} from '@airbus/components-react';
import { TabElement, extractTabs, useApiClient, useAuth } from '@df/utils';
import { useNavigate } from 'react-router-dom';
import { routeConfig } from '../../router/routeConfig';

function UserPage() {
  const { logout } = useAuth();
  const { post } = useApiClient();
  return (
    <>
      <Divider />
      <Button onClick={() => logout()}>Logout</Button>
      <Button onClick={() => post('api/users/')}>Create my user</Button>
    </>
  );
}

export default UserPage;
