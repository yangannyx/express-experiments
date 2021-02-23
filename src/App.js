import React from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import {ROUTES} from './pages/routes';

export default () => {
  return (
      <Switch>
        {
          ROUTES.map((route) => <Route {...route}/>)
        }
      </Switch>
  );
};
