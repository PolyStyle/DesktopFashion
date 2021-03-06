import chalk from 'chalk';
import { injectReducer } from './redux/reducers';
import App from './containers/App';

const errorLoading = (err) => {
  console.error(chalk.red(`==> 😭  Dynamic page loading failed ${err}`));
};

const loadModule = cb => (Component) => {
  cb(null, Component.default);
};

export default function createRoutes(store) {
  return {
    component: App,
    childRoutes: [
      {
        path: '/',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Home'),
            System.import('./containers/Home/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, reducer]) => {
              injectReducer(store, 'home', reducer.default);

              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/UserInfo/:id',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/UserInfo'),
            System.import('./containers/UserInfo/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, reducer]) => {
              injectReducer(store, 'userInfo', reducer.default);

              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/products',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Products'),
            System.import('./containers/Products/reducer'),
            System.import('./containers/Tags/reducer'),
            System.import('./containers/Brands/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, ...reducers]) => {
              injectReducer(store, 'products', reducers[0].default);
              injectReducer(store, 'tags', reducers[1].default);
              injectReducer(store, 'brands', reducers[2].default);
              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/posts',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Posts'),
            System.import('./containers/Posts/reducer'),
            System.import('./containers/Products/reducer'),
            System.import('./containers/Tags/reducer'),
            System.import('./containers/Brands/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, ...reducers]) => {
              injectReducer(store, 'posts', reducers[0].default);
              injectReducer(store, 'products', reducers[1].default);
              injectReducer(store, 'tags', reducers[2].default);
              injectReducer(store, 'brands', reducers[3].default);
              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/tags',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Tags'),
            System.import('./containers/Tags/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, reducer]) => {
              injectReducer(store, 'tags', reducer.default);

              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/brands',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Brands'),
            System.import('./containers/Brands/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, reducer]) => {
              injectReducer(store, 'brands', reducer.default);

              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '/users',
        getComponent(nextState, cb) {
          const importModules = Promise.all([
            System.import('./containers/Users'),
            System.import('./containers/Users/reducer'),
          ]);

          const renderRoute = loadModule(cb);

          importModules
            .then(([Component, reducer]) => {
              injectReducer(store, 'users', reducer.default);
              renderRoute(Component);
            })
            .catch(errorLoading);
        },
      },
      {
        path: '*',
        getComponent(location, cb) {
          System.import('./containers/NotFound')
            .then(loadModule(cb))
            .catch(errorLoading);
        },
      },
    ],
  };
}
