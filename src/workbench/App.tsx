import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import './App.css';

function App() {
  const getSettings = () => {
    const settings = localStorage.getItem('settings');
    console.log(settings);
  };

  const openSettings = async () => {
    const settingWindow = await WebviewWindow.getByLabel('setting');
    settingWindow?.setAlwaysOnTop(true);
    settingWindow?.show();
    settingWindow?.setFocus();
    settingWindow?.setAlwaysOnTop(false);
  };

  return (
    <div className='w-full h-full flex'>
      <div className='w-240px h-full flex flex-col of-hidden b-r-1 b-solid b-line'>
        <div className='h-50px b-b-1 b-solid b-line flex items-center justify-center'>
          LOGO
        </div>
        <div className='flex-1 h-full p-16px'>
          123
        </div>
        <div className='flex items-center justify-center p-16px'>settings</div>
      </div>
      <div className='flex-1 w-full of-hidden'>
        <button onClick={getSettings}>获取设置</button>
        <button onClick={openSettings}>打开设置页</button>
      </div>
    </div>
  );
}

export default App;
