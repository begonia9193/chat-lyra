export interface Model {
  id: string;
  name: string;
  description: string;
  context_length: number;
  max_output_length?: number;
  pricing: {
    input: number
    output: number
    image?: number
  };
  input_modalities: ('image' | 'txt' | 'file')[]
  output_modalities: ('image' | 'txt' | 'file')[]
}