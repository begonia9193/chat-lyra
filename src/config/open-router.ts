const OPEN_ROUTER_API_STORAGE_KEY = 'openrouter_api_key';

export const getOpenRouterApiKey = () => {
  return localStorage.getItem(OPEN_ROUTER_API_STORAGE_KEY);
};

export const setOpenRouterApiKey = (apiKey: string) => {
  localStorage.setItem(OPEN_ROUTER_API_STORAGE_KEY, apiKey);
};

export const removeOpenRouterApiKey = () => {
  localStorage.removeItem(OPEN_ROUTER_API_STORAGE_KEY);
};