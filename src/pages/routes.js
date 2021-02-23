import Home from './Home';
import List from './List';
import NotFound from './NotFound';

export const ROUTES = [
  {
    path: '/',
    exact: true,
    render: () => <Home name={'Anny'}/>,
  },
  {
    path: '/list',
    component: List,
  },
  {
    component: NotFound
  }
];
