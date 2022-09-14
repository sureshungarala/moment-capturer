import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { swEventName } from './utils/constants';

// Moved Router here to access `location` for GA tracking
ReactDOM.render(
  <Router>
    <App />
  </Router>,
  document.getElementById('root')
);

// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register({
  onUpdate: (registration: ServiceWorkerRegistration) => {
    document.dispatchEvent(new CustomEvent(swEventName, { detail: 'update' }));
    document.addEventListener(swEventName, ((event: CustomEvent) => {
      if (event.detail === 'proceed-update') {
        registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      }
      window.location.reload();
    }) as EventListener);
  },
  onSuccess: (_registration: ServiceWorkerRegistration) => {
    document.dispatchEvent(new CustomEvent(swEventName, { detail: 'success' }));
  },
});
