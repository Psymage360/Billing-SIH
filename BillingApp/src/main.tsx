import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
(window as any).global = window;
import Amplify from 'aws-amplify';
// Amplify.configure({
//   aws_project_region: 'ap-south-1',
//   aws_cognito_region: 'ap-south-1', // (optional) Default region for project
// });
import { defineCustomElements } from '@ionic/pwa-elements/loader';
defineCustomElements(window);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);