// Polyfill global for Amplify
if (typeof window !== 'undefined') {
  (window as any).global = window;
}

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';

import App from './App';
import './index.css';

import * as serviceWorker from './serviceWorker';
import { swEventName } from './utils/constants';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Moved Router here to access `location` for GA tracking
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </Router>
  </QueryClientProvider>,
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
