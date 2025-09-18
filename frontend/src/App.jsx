import { Toaster } from 'react-hot-toast';
import Router from './routes/Router';
import GlobalLoader from './components/GlobalLoader';
import { useAuth } from './context/authContext';
import { connectSocket, disconnectSocket } from './socket/socket';
import { useEffect } from 'react';

function App() {
  const { user } = useAuth()
  useEffect(()=>{
    if (user) {
      connectSocket();
    }
    return () => {
      disconnectSocket();
    };
  },[user])
  
  return (
    <>
       <GlobalLoader />
        <Router />

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            padding: '12px 16px',
            fontSize: '15px',
            borderRadius: '8px',
            background: '#fff',
            color: '#333',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

    </>
  );
}

export default App