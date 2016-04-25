import { Router } from 'express';
import { RouterContext, match } from 'react-router';
import { Provider } from 'react-redux';
import { routes } from '../public/src/routes.jsx';
import { renderToString } from 'react-dom/server';
import React from 'react';

export function router(store) {
  const router = Router();

  /* GET home page. */
  router.get('*', (req, res, next) => {
    match({routes, location: req.baseUrl || '/'}, (error, redirectLocation, renderProps) => {
      if (error) {
        // This is probably not how I want to do this, beccause it will render a terrifying
        // message to the users
        res.status(500).send(error.message);
      } else if (redirectLocation) {
        // NOTE(arthurb): This one, otoh, is kinda interesting.
        res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      } else if (renderProps) {
        var component = renderToString(
          <Provider store={store}>
            <RouterContext {...renderProps} />
          </Provider>
        );
        res.render('index', {
          title: 'Whodapet',
          component,
          initialState: store.getState()
        });
      }
    });
  });

  return router;
}
