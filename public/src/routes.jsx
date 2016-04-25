import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import {VotingContainer} from './components/Voting';
import {ResultsContainer} from './components/Results';

export const routes = (<Route component={App}>
  <Route path="/" component={VotingContainer} />
  <Route path="/results" component={ResultsContainer} />
</Route>);
