import { Button } from '@mui/material';
import { Icon } from '@/components/Icon';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ChatPage } from '../pages/chat';
import cn from 'classnames';
import { platform } from '@tauri-apps/plugin-os';

export default function Layout() {
  const openSettings = async () => {
    const settingWindow = await WebviewWindow.getByLabel('setting');
    settingWindow?.setAlwaysOnTop(true);
    settingWindow?.show();
    settingWindow?.setFocus();
    settingWindow?.setAlwaysOnTop(false);
  };

  return (
    <HashRouter>
      <div className='w-full h-full flex'>
        <div className='w-full h-25px shrink-0 absolute top-0 left-0' data-tauri-drag-region></div>
        <div
          className={
            cn('w-220px h-full flex flex-col of-hidden b-r-1 b-solid b-line/60% pt-16px bg-primary/12%', {
              'pt-35px': platform() === 'macos'
            })}
        >
          <div className='px-10px flex items-center gap-8px'>
            <div className='rd-6px bg-bg_3/8% h-36px w-full flex items-center of-hidden b-transparent b-2px b-solid hover:b-primary/60% focus-within:b-primary/60%'>
              <Icon icon='i-icons-search' className='size-20px! absolute left-22px c-font_1' />
              <input
                className='pl-35px mt-1px outline-none b-none h-full w-full bg-transparent text-14px/22px'
                placeholder=' 搜索会话'
              />
            </div>
          </div>
          <div className='flex-1 h-full p-16px'>
            会话列表
          </div>
          <div className='h-40px px-16px flex items-center b-t-1 b-solid b-line/20%'>
            <Button size='small' className='flex gap-4px items-center' onClick={openSettings}>
              <Icon icon='i-icons-setting' className='size-16px!' />
              <span className='text-14px font-500'>设置</span>
            </Button>
          </div>
        </div>
        <div className={cn('flex-1 w-full of-hidden', {
          'pt-25px': platform() === 'macos'
        })}>
          <Routes>
            <Route path="/" element={<Navigate to="/chat/new-conversation" replace />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
