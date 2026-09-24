import { createClient } from '@supabase/supabase-js';

// Garante que a URL e chave existam e sejam válidas antes de criar o cliente
const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const rawKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabaseUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://')
    ? rawUrl
    : 'https://placeholder.supabase.co';
const supabaseAnonKey = rawKey || 'placeholder-key';

// Conexão oficial com o banco
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function uploadImage(file: File, _bucket: string = 'barber-images'): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            if (typeof reader.result === 'string') {
                resolve(reader.result);
            } else {
                reject(new Error("Erro ao processar imagem"));
            }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
