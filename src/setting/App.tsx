import './App.css';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ModelProvider } from './pages/ModelProvider';
import { MCP } from './pages/MCP';
import { SideMenu } from './layout/SideMenu';
import { MUIThemeProvider } from '@/provider/MUIThemeProvider';

function App() {
  return (
    <MUIThemeProvider>
      <HashRouter>
        <div className='w-full h-full flex flex-col'>
          <div className='h-50px font-500 text-24px b-b-1 b-solid b-line/60% px-24px flex items-center'>
          设置
        </div>
        <div className='w-full h-full flex-1 of-hidden flex'>
          <SideMenu />
          <div className='flex-1 of-auto'>
            <Routes>
              <Route path="/" element={<Navigate to="/model-provider" replace />} />
              <Route path="/model-provider" element={<ModelProvider />} />
              <Route path="/mcp" element={<MCP />} />
            </Routes>
          </div>
          </div>
        </div>
      </HashRouter>
    </MUIThemeProvider>
  );
}

export default App;
