import { OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel, Skeleton } from '@mui/material';
import { memo, useEffect, useState } from "react";
import { useMemoizedFn, useRequest } from 'ahooks';
import { Icon } from '@/components/Icon';
import { getOpenRouterApiKey, removeOpenRouterApiKey, setOpenRouterApiKey } from '@/config/open-router';
import { getCredits } from '@/apis/open-router/api';

export const ModelProvider = memo(() => {
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const {
    data: creditsInfo,
    loading: creditsLoading,
    error: creditsError,
    refresh: refreshCredits
  } = useRequest(async () => {
    const res = await getCredits();
    return res.data;
  }, {
    refreshDeps: [apiKey]
  });

  useEffect(() => {
    const apiKey = getOpenRouterApiKey();
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  const handleSaveApiKey = useMemoizedFn((apiKey: string) => {
    if (apiKey.trim()) {
      setOpenRouterApiKey(apiKey);
    } else {
      removeOpenRouterApiKey();
    }
  });

  const togglePasswordVisibility = useMemoizedFn(() => {
    setShowPassword(prev => !prev);
  });

  return (
    <div className='w-full h-full of-y-auto'>
      <div className="mb-16px font-500 text-16px b-b-1 b-solid b-line/60% p-16px">
        OpenRouter
      </div>
      <div className='form px-16px'>
        <div className='form-item'>
          <FormControl variant='outlined' size='small' fullWidth>
            <InputLabel htmlFor="outlined-adornment-password">API Key</InputLabel>
            <OutlinedInput
              label="API Key"
              id="outlined-adornment-password"
              type={showPassword ? 'text' : 'password'}
              fullWidth
              value={apiKey}
              onChange={(e) => {
                handleSaveApiKey(e.target.value);
                setApiKey(e.target.value);
              }}
              placeholder='请输入API Key'
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={togglePasswordVisibility}
                    edge="end"
                    size="small"
                  >
                    <Icon icon={showPassword ? 'i-icons-eye-off' : 'i-icons-eye'} />
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </div>
      </div>
      {!!apiKey && (
        <div className="px-16px mt-12px group">
          {/* 骨架屏或验证结果 */}
          {creditsLoading ? (
            <>
              <Skeleton animation="wave" width={80} height={30} />
              <Skeleton animation="wave" width={100} height={30} />
            </>
          ) : creditsError ? (
            <div className="flex items-center c-error font-500">
              <Icon icon="i-icons-error" className="size-16px!" />
              <span className='ml-6px'>验证失败</span>
              <span
                className='size-24px ml-6px rd-4px hover:bg-bg_3/8% cursor-pointer flex items-center justify-center invisible group-hover:visible'
                onClick={() => refreshCredits()}
              >
                <Icon icon="i-icons-refresh" className='size-14px! c-font_1' />
              </span>
            </div>
          ) : (
            creditsInfo && (
              <>
                <div className="text-green-500 flex items-center c-success font-500">
                  <Icon icon="i-icons-success" className="size-16px" />
                  <span className='ml-6px'>验证成功</span>
                  <span
                    className='size-24px ml-6px rd-4px hover:bg-bg_3/8% cursor-pointer flex items-center justify-center invisible group-hover:visible'
                    onClick={() => refreshCredits()}
                  >
                    <Icon icon="i-icons-refresh" className='size-14px! c-font_1' />
                  </span>
                </div>
                <div className="flex items-center mt-4px">
                  <Icon icon="i-icons-dollar" className="size-16px c-orange relative top-1px" />
                  <div className="flex items-center gap-4p ml-6px">
                    <span>剩余积分：</span>
                    <span className='font-bold c-success'>{(creditsInfo.total_credits - creditsInfo.total_usage).toFixed(2)}</span>
                    <span className='mx-4px'>/</span>
                    <span className='font-500 c-font_1'>{creditsInfo.total_credits}</span>
                  </div>
                </div>
              </>
            )
          )}
        </div>
      )}
    </div>
  );
});
