// --------------------------------------------------------
// DeepSeek AI Client — secure integration with Supabase Edge Functions
// --------------------------------------------------------
import OpenAI from 'openai';
import { supabase } from './supabase';

const apiKey = import.meta.env.VITE_DEEPSEEK_API_KEY;

// Keep OpenAI instance as local fallback for development purposes
const localOpenai = apiKey ? new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Necessary for local client-side fallback
}) : null;

if (!apiKey) {
  console.log(
    '[Paradise] No local VITE_DEEPSEEK_API_KEY detected. Calls will go entirely through Supabase Edge Functions.'
  );
}

export function getModel(modelName = 'deepseek-chat') {
  return {
    generateContent: async (promptArgs) => {
      let textPrompt = '';
      
      // Handle the case where promptArgs is an array (like in Gemini)
      if (Array.isArray(promptArgs)) {
        textPrompt = promptArgs.map(item => {
          if (typeof item === 'string') return item;
          if (item.inlineData) return '[Image provided, but DeepSeek only processes text. Please describe the image conceptually.]';
          return JSON.stringify(item);
        }).join('\n');
      } else {
        textPrompt = promptArgs;
      }

      // 1. Try to call the secure Supabase Edge Function first
      try {
        const { data, error } = await supabase.functions.invoke('deepseek', {
          body: { prompt: textPrompt, model: modelName }
        });

        if (error) throw error;
        if (data && data.text) {
          return {
            response: {
              text: () => data.text
            }
          };
        }
      } catch (edgeError) {
        console.warn('[Paradise] Supabase Edge Function call failed/not deployed. Falling back to local OpenAI client...', edgeError);
      }

      // 2. Local fallback if API key is present in environment
      if (localOpenai) {
        const response = await localOpenai.chat.completions.create({
          messages: [{ role: 'user', content: textPrompt }],
          model: modelName,
        });

        return {
          response: {
            text: () => response.choices[0].message.content
          }
        };
      }

      throw new Error(
        'DeepSeek calls failed: Supabase Edge Function is not deployed/configured, and no local VITE_DEEPSEEK_API_KEY is available in .env.'
      );
    }
  };
}

// Export a default model instance for convenience
export const deepseekModel = getModel();
