import './App.css';
import { MUIThemeProvider } from '@/provider/MUIThemeProvider';
import Layout from './layout/Layout';
import { useModelStore } from './store/models';
import { useEffect } from 'react';

function App() {
  const { init } = useModelStore()

  useEffect(() => {
    init()
  }, [])
  
  return (
    <MUIThemeProvider>
      <Layout />
    </MUIThemeProvider>
  );
}

export default App;
