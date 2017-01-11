import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import config from '../../config';

import '../../theme/normalize.css';
import styles from './styles.css';

const App = ({ children }) => (
  <div className={styles.AppStyle}>
    <Helmet {...config.app} />
    <div className={styles.header}>
      <h1>{config.app.title}</h1>
      <ul className={styles.menu} >
        <li><Link to={'/tags'}>Tags</Link></li>
        <li><Link to={'/brands'}>Brands</Link></li>
        <li><Link to={'/products'}>Products</Link></li>
        <li><Link to={'/posts'}>Posts</Link></li>
      </ul>
    </div>
    {children}
  </div>
);

App.propTypes = { children: PropTypes.node };

export default App;
