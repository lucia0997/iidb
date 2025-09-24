import { RootRouteNode } from '@df/utils';

import { LoginPage } from '../pages/LoginPage';
import { UserPage } from '../pages/UserPage';
import { AdminPage } from '../pages/AdminPage';
import { HomeScreen } from '@df/ui';

export const routeConfig: RootRouteNode[] = [
  {
    kind: 'route',
    key: 'home',
    path: '/',
    element: <HomeScreen />,
  },
  {
    kind: 'page',
    key: 'root1',
    path: '/root1',
    element: <UserPage />,
    tabName: 'root1',
  },
  {
    kind: 'page',
    key: 'root2',
    path: '/root2',
    element: <UserPage />,
    tabName: 'root2',
    children: [
      {
        kind: 'page',
        key: 'sub1',
        path: '/sub1',
        element: <UserPage />,
        tabName: 'sub1',
      },
      {
        kind: 'page',
        key: 'sub2',
        path: '/sub2',
        element: <UserPage />,
        tabName: 'sub2',
        children: [
          {
            kind: 'page',
            key: 'subsub1',
            path: '/subsub1',
            element: <UserPage />,
            tabName: 'subsub1',
          },
          {
            kind: 'page',
            key: 'subsub2',
            path: '/subsub2',
            element: <UserPage />,
            tabName: 'subsub2',
          },
        ],
      },
      {
        kind: 'tabGroup',
        key: 'sub3',
        tabName: 'sub3',
        children: [
          {
            kind: 'page',
            key: 'subsub1b',
            path: '/subsub1b',
            element: <UserPage />,
            tabName: 'subsub1b',
          },
        ],
      },
    ],
  },
  {
    kind: 'tabGroup',
    key: 'root3',
    tabName: 'root3',
    children: [
      {
        kind: 'page',
        key: 'sub1b',
        path: '/sub1b',
        element: <UserPage />,
        tabName: 'sub1b',
      },
    ],
  },
  {
    kind: 'page',
    key: 'ex1',
    path: '/ex1',
    element: <UserPage />,
    tabName: 'ex1',
    children: [
      {
        kind: 'page',
        key: 'ex2',
        path: '/ex2',
        element: <AdminPage />,
        tabName: 'ex2',
        requiredPermissions: ['a'],
      },
    ],
  },
];
