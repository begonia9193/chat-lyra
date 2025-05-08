import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import './App.css';
import { Icon } from '@/components/Icon';
import { Button } from '@mui/material';

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
      <div className='w-full h-25px shrink-0 absolute top-0 left-0' data-tauri-drag-region></div>
      <div className='w-240px h-full flex flex-col of-hidden b-r-1 b-solid b-line/60% pt-10px'>
        <div className='h-50px b-b-1 b-solid b-line/60% flex items-center justify-center'>
          LOGO
        </div>
        <div className='flex-1 h-full p-16px'>
          123
        </div>
        <div className='h-40px flex items-center b-t-1 b-solid b-line/60%'>
          <Button size='small' className='flex gap-4px items-center' onClick={openSettings}>
            <Icon icon='i-icons-setting' className='size-16px!' />
            <span className='text-14px font-500'>设置</span>
          </Button>
        </div>
      </div>
      <div className='flex-1 w-full of-hidden pt-30px'>
        <button onClick={getSettings}>获取设置</button>
        <button onClick={openSettings}>打开设置页</button>
      </div>
    </div>
  );
}

export default App;
