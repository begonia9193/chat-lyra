import { OutlinedInput, InputAdornment, IconButton, FormControl, InputLabel } from '@mui/material';
import { memo, useEffect, useState } from "react";
import { useMemoizedFn } from 'ahooks';
import { debounce } from 'lodash-es';
import { Icon } from '@/components/Icon';

export const ModelProvider = memo(() => {
  const [apiKey, setApiKey] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const apiKey = localStorage.getItem('openrouter_api_key');
    if (apiKey) {
      setApiKey(apiKey);
    }
  }, []);

  const handleSaveApiKey = useMemoizedFn(debounce((apiKey: string) => {
    if (apiKey.trim()) {
      localStorage.setItem('openrouter_api_key', apiKey);
    } else {
      localStorage.removeItem('openrouter_api_key');
    }
  }, 300));

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
                setApiKey(e.target.value);
                handleSaveApiKey(e.target.value);
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
    </div>
  );
});
