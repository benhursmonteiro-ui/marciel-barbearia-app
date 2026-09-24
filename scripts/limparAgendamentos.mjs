import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, writeBatch } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
    console.error('[MBS Firebase Script] Erro: Chaves do Firebase não encontradas no .env.local');
    process.exit(1);
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

async function limparAgendamentos(modoOuDias = 7) {
    // Obter data e hora atual no fuso horário do Brasil
    const agora = new Date();
    const hojeStr = agora.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' }); // formato YYYY-MM-DD
    const horaAtualStr = agora.toLocaleTimeString('pt-BR', { timeZone: 'America/Sao_Paulo', hour: '2-digit', minute: '2-digit' });

    try {
        console.log(`[MBS Firebase] Conectando ao Firestore (${firebaseConfig.projectId})...`);
        const snapshot = await getDocs(collection(db, 'agendamentos'));
        
        let docsParaApagar = [];

        if (modoOuDias === 0 || modoOuDias === 'passados') {
            console.log(`[MBS Firebase] Identificando agendamentos que já passaram...`);
            console.log(`[MBS Firebase] Data de corte atual: ${hojeStr}, Horário atual: ${horaAtualStr}`);

            snapshot.forEach(docSnap => {
                const d = docSnap.data();
                const dataDoc = d.date || d.data || '';
                const horaDoc = d.time || d.horario || '';

                if (dataDoc && dataDoc < hojeStr) {
                    docsParaApagar.push(docSnap.id);
                } else if (dataDoc === hojeStr && horaDoc && horaDoc < horaAtualStr) {
                    docsParaApagar.push(docSnap.id);
                }
            });
        } else {
            const dias = typeof modoOuDias === 'number' ? modoOuDias : parseInt(modoOuDias, 10);
            const dataLimite = new Date();
            dataLimite.setDate(dataLimite.getDate() - dias);
            const dataLimiteStr = dataLimite.toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });

            console.log(`[MBS Firebase] Identificando agendamentos com mais de ${dias} dias (anteriores a ${dataLimiteStr})...`);

            snapshot.forEach(docSnap => {
                const d = docSnap.data();
                const dataDoc = d.date || d.data || '';
                if (dataDoc && dataDoc < dataLimiteStr) {
                    docsParaApagar.push(docSnap.id);
                }
            });
        }

        if (docsParaApagar.length === 0) {
            console.log(`[MBS Firebase] Nenhum agendamento encontrado para ser excluído.`);
            process.exit(0);
        }

        console.log(`[MBS Firebase] Apagando ${docsParaApagar.length} agendamento(s)...`);

        const BATCH_SIZE = 400;
        for (let i = 0; i < docsParaApagar.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const pedaco = docsParaApagar.slice(i, i + BATCH_SIZE);
            for (const id of pedaco) {
                batch.delete(doc(db, 'agendamentos', id));
            }
            await batch.commit();
        }

        console.log(`[MBS Firebase] Sucesso! ${docsParaApagar.length} agendamento(s) apagado(s) do Firebase.`);
        process.exit(0);
    } catch (error) {
        console.error('[MBS Firebase] Falha ao apagar agendamentos:', error);
        process.exit(1);
    }
}

// Argumento via terminal (ex: "node scripts/limparAgendamentos.mjs 0" ou "node scripts/limparAgendamentos.mjs 7")
const arg = process.argv[2];
let param = 7;
if (arg !== undefined) {
    param = isNaN(Number(arg)) ? arg : Number(arg);
}

limparAgendamentos(param);
