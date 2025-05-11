import './App.css';
import { MUIThemeProvider } from '@/provider/MUIThemeProvider';
import Layout from './layout/Layout';

function App() {
  return (
    <MUIThemeProvider>
      <Layout />
    </MUIThemeProvider>
  );
}

export default App;
