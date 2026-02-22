import React from 'react';
import { useGoogleLogin } from '@react-oauth/google';

export default function Auth() {
  const login = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const res = await fetch('http://localhost:8787/auth/callback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code: codeResponse.code })
        });
        const data = await res.json();
        console.log('Backend response:', data);
        alert('✅ OAuth exitoso: ' + JSON.stringify(data));
      } catch (error) {
        console.error('Error:', error);
        alert('❌ Error: ' + error.message);
      }
    },
    onError: (errorResponse) => {
      console.error('Login error:', errorResponse);
      alert('❌ Error de login');
    },
    flow: 'auth-code',
    scope: 'https://www.googleapis.com/auth/spreadsheets'
  });

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>RegApp Contacts</h1>
      <button onClick={login} style={{
        padding: '12px 24px',
        backgroundColor: '#4285F4',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '16px'
      }}>
        🔵 Iniciar sesión con Google
      </button>
    </div>
  );
}