import React from 'react';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Auth from './components/Auth';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="887315811927-3afm2o5k2l9t9938p4qohopra9ll7pah.apps.googleusercontent.com">
      <Auth />
    </GoogleOAuthProvider>
  </React.StrictMode>
);