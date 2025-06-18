import { request } from './http';

export const getCredits = () => {
  return request.get('/credits');
};

interface Architecture {
  input_modalities: ('image' | 'txt' | 'file')[];
  output_modalities: ('image' | 'txt' | 'file')[];
  tokenizer: string;
}

interface TopProvider {
  is_moderated: boolean;
}

interface Pricing {
  prompt: string;
  completion: string;
  image: string;
  request: string;
  input_cache_read: string;
  input_cache_write: string;
  web_search: string;
  internal_reasoning: string;
}

interface PerRequestLimits {
  [key: string]: any;
}

export interface OpenerRouterModel {
  id: string;
  name: string;
  created: number;
  description: string;
  architecture: Architecture;
  top_provider: TopProvider;
  pricing: Pricing;
  context_length: number;
  hugging_face_id: string;
  per_request_limits: PerRequestLimits;
  supported_parameters: string[];
}

export const getModels = (): Promise<{ data: OpenerRouterModel[] }> => {
  return request.get('/models')
}