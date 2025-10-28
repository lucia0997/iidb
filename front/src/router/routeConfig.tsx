import { RootRouteNode } from '@df/utils';
import { AdminPage } from '../pages/AdminPage';
import MainMenu from '../pages/MainMenu/MainMenu';

export const routeConfig: RootRouteNode[] = [
  {
    kind: 'route',
    key: 'home',
    path: '/',
    element: <MainMenu/>,
  },
  {
    kind: 'page',
    key: 'adminPanel',
    path: '/admin',
    element: <AdminPage />,
    tabName: 'Admin Panel',
    requiredPermissions: ['users.edit_users'],
  },
];
