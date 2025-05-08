import { request } from './http';

export const getCredits = () => {
  return request.get('/credits');
};
