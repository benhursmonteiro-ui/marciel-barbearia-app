import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Erro: Chaves do Supabase não encontradas no .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function exportarDados() {
    console.log('🚀 Iniciando extração dos dados do Supabase...');
    const tabelas = ['usuarios', 'servicos', 'barbeiros', 'agendamentos'];
    const backup = {};

    for (const tabela of tabelas) {
        console.log(`📦 Baixando registros da tabela "${tabela}"...`);
        const { data, error } = await supabase.from(tabela).select('*');
        if (error) {
            console.error(`❌ Erro ao baixar "${tabela}":`, error.message);
            backup[tabela] = [];
        } else {
            console.log(`✓ "${tabela}": ${data.length} registro(s) obtido(s).`);
            backup[tabela] = data;
        }
    }

    const backupDir = path.resolve(__dirname, '../backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFile = path.join(backupDir, `backup_supabase_${timestamp}.json`);
    const backupLatest = path.join(backupDir, `backup_supabase_latest.json`);

    fs.writeFileSync(backupFile, JSON.stringify(backup, null, 2), 'utf-8');
    fs.writeFileSync(backupLatest, JSON.stringify(backup, null, 2), 'utf-8');

    console.log(`\n🎉 Backup concluído com sucesso!`);
    console.log(`📁 Arquivo salvo em: ${backupFile}`);
    console.log(`📁 Arquivo mais recente: ${backupLatest}`);
}

exportarDados()
    .then(() => setTimeout(() => process.exit(0), 1000))
    .catch((err) => {
        console.error('❌ Erro fatal no backup:', err);
        process.exit(1);
    });
