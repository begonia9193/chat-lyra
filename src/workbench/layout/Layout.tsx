import { Button, TextField } from '@mui/material';
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
        <div className={cn('w-220px h-full flex flex-col of-hidden b-r-1 b-solid b-line/60% pt-16px', {
          'pt-35px': platform() === 'macos'
        })}>
          <div className='px-10px flex items-center gap-8px'>
            <Icon icon='i-icons-search' className='size-24px! absolute left-22px c-font_1' />
            <TextField
              size='small'
              variant='outlined'
              placeholder="搜索会话"
              className='h-40px [&_input]:pl-35px'
            />
          </div>
          <div className='flex-1 h-full p-16px'>
            会话列表
          </div>
          <div className='h-40px px-16px flex items-center b-t-1 b-solid b-line/60%'>
            <Button size='small' className='flex gap-4px items-center' onClick={openSettings}>
              <Icon icon='i-icons-setting' className='size-16px!' />
              <span className='text-14px font-500'>设置</span>
            </Button>
          </div>
        </div>
        <div className='flex-1 w-full of-hidden'>
          <Routes>
            <Route path="/" element={<Navigate to="/chat/new-conversation" replace />} />
            <Route path="/chat/:id" element={<ChatPage />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
}
