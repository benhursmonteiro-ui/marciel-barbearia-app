import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, doc, writeBatch } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Verifica se as credenciais do Firebase foram configuradas
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const camposFaltando = Object.entries(firebaseConfig)
    .filter(([_, valor]) => !valor || valor.includes('placeholder') || valor.includes('demo'))
    .map(([chave]) => chave);

if (camposFaltando.length > 0) {
    console.error('❌ ERRO: As credenciais do Firebase ainda não estão configuradas no .env.local!');
    console.error('Variáveis pendentes ou com valor de exemplo:');
    camposFaltando.forEach(campo => console.error(`  - ${campo}`));
    console.error('\nAdicione suas chaves do Firebase Console no arquivo .env.local antes de rodar este script.');
    process.exit(1);
}

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);

// Carrega os dados exportados do Supabase
const backupPath = path.resolve(__dirname, '../backups/backup_supabase_latest.json');
if (!fs.existsSync(backupPath)) {
    console.error('❌ Arquivo de backup do Supabase não encontrado em:', backupPath);
    console.error('Execute primeiro: node scripts/exportarSupabase.mjs');
    process.exit(1);
}

const dados = JSON.parse(fs.readFileSync(backupPath, 'utf-8'));

async function migrarColecao(nomeColecao, itens, formatador) {
    if (!itens || itens.length === 0) {
        console.log(`ℹ️ [${nomeColecao}] Nenhum item para migrar.`);
        return;
    }

    console.log(`\n📤 [${nomeColecao}] Iniciando migração de ${itens.length} registro(s)...`);
    const BATCH_SIZE = 400; // Limite do Firestore é 500
    let totalMigrado = 0;

    for (let i = 0; i < itens.length; i += BATCH_SIZE) {
        const pedaco = itens.slice(i, i + BATCH_SIZE);
        const batch = writeBatch(db);

        for (const item of pedaco) {
            const docId = String(item.id);
            const docRef = doc(db, nomeColecao, docId);
            const docFormatado = formatador(item);
            batch.set(docRef, docFormatado, { merge: true });
        }

        await batch.commit();
        totalMigrado += pedaco.length;
        console.log(`  ✓ [${nomeColecao}] ${totalMigrado}/${itens.length} migrados...`);
    }

    console.log(`✅ [${nomeColecao}] Todos os ${totalMigrado} registros foram enviados com sucesso!`);
}

function cleanPhoto(photo) {
    if (!photo) return '';
    if (typeof photo === 'string' && photo.length > 500000) {
        return '';
    }
    return photo;
}

async function executarMigracao() {
    console.log('=====================================================');
    console.log('🔥 INICIANDO MIGRAÇÃO SUPABASE -> FIREBASE FIRESTORE');
    console.log(`Projeto Firebase: ${firebaseConfig.projectId}`);
    console.log('=====================================================');

    // 1. Usuários
    await migrarColecao('usuarios', dados.usuarios, (u) => {
        const safePhoto = cleanPhoto(u.foto_url || u.photo);
        return {
            id: String(u.id),
            name: u.nome || u.name || '',
            nome: u.nome || u.name || '',
            email: (u.email || '').trim().toLowerCase(),
            phone: u.telefone || u.phone || '',
            telefone: u.telefone || u.phone || '',
            role: u.funcao || u.role || 'client',
            funcao: u.funcao || u.role || 'client',
            photo: safePhoto,
            foto_url: safePhoto,
            password: u.senha || u.password || '',
            senha: u.senha || u.password || '',
            completedProfile: Boolean(u.perfil_completo),
            perfil_completo: Boolean(u.perfil_completo),
            blocked: Boolean(u.bloqueado),
            bloqueado: Boolean(u.bloqueado),
            createdAt: u.criado_at || u.createdAt || new Date().toISOString(),
            criado_at: u.criado_at || u.createdAt || new Date().toISOString()
        };
    });

    // 2. Serviços
    await migrarColecao('servicos', dados.servicos, (s) => ({
        id: String(s.id),
        name: s.nome || s.name || '',
        nome: s.nome || s.name || '',
        description: s.descricao || s.description || '',
        descricao: s.descricao || s.description || '',
        price: Number(s.preco ?? s.price ?? 0),
        preco: Number(s.preco ?? s.price ?? 0),
        duration: s.duracao || s.duration || '30 min',
        duracao: s.duracao || s.duration || '30 min',
        icon: s.icone || s.icon || '✂️',
        icone: s.icone || s.icon || '✂️',
        popular: Boolean(s.popular),
        active: s.ativo !== false && s.active !== false,
        ativo: s.ativo !== false && s.active !== false,
        createdAt: s.criado_at || s.createdAt || new Date().toISOString()
    }));

    // 3. Barbeiros
    await migrarColecao('barbeiros', dados.barbeiros, (b) => ({
        id: String(b.id),
        userId: String(b.usuario_id || b.userId || b.id),
        usuario_id: String(b.usuario_id || b.userId || b.id),
        name: b.nome || b.name || '',
        nome: b.nome || b.name || '',
        specialty: b.especialidade || b.specialty || '',
        especialidade: b.especialidade || b.specialty || '',
        commission: Number(b.comissao ?? b.commission ?? 50),
        comissao: Number(b.comissao ?? b.commission ?? 50),
        rating: Number(b.rating ?? 5),
        reviews: Number(b.reviews ?? b.total_reviews ?? 0),
        total_reviews: Number(b.reviews ?? b.total_reviews ?? 0),
        photo: cleanPhoto(b.foto || b.foto_url || b.photo || ''),
        foto: cleanPhoto(b.foto || b.foto_url || b.photo || ''),
        active: b.ativo !== false && b.active !== false,
        ativo: b.ativo !== false && b.active !== false,
        workingHours: b.horarios_trabalho || b.workingHours || null,
        horarios_trabalho: b.horarios_trabalho || b.workingHours || null,
        blockedSlots: Array.isArray(b.horarios_bloqueados) ? b.horarios_bloqueados : (b.blockedSlots || []),
        horarios_bloqueados: Array.isArray(b.horarios_bloqueados) ? b.horarios_bloqueados : (b.blockedSlots || []),
        holidays: Array.isArray(b.feriados) ? b.feriados : (b.holidays || []),
        feriados: Array.isArray(b.feriados) ? b.feriados : (b.holidays || []),
        bio: b.bio || '',
        createdAt: b.criado_at || b.createdAt || new Date().toISOString()
    }));

    // 4. Agendamentos
    await migrarColecao('agendamentos', dados.agendamentos, (a) => ({
        id: String(a.id),
        clientId: String(a.cliente_id || a.clientId || ''),
        cliente_id: String(a.cliente_id || a.clientId || ''),
        clientName: a.nome_cliente || a.clientName || 'Cliente',
        nome_cliente: a.nome_cliente || a.clientName || 'Cliente',
        clientPhone: a.telefone_cliente || a.clientPhone || '',
        telefone_cliente: a.telefone_cliente || a.clientPhone || '',
        barberId: String(a.barbeiro_id || a.barberId || ''),
        barbeiro_id: String(a.barbeiro_id || a.barberId || ''),
        barberName: a.nome_barbeiro || a.barberName || '',
        nome_barbeiro: a.nome_barbeiro || a.barberName || '',
        serviceId: String(a.servico_id || a.serviceId || ''),
        servico_id: String(a.servico_id || a.serviceId || ''),
        serviceName: a.nome_servico || a.serviceName || '',
        nome_servico: a.nome_servico || a.serviceName || '',
        price: Number(a.valor ?? a.price ?? 0),
        valor: Number(a.valor ?? a.price ?? 0),
        commission: Number(a.comissao_gerada ?? a.commission ?? 0),
        comissao_gerada: Number(a.comissao_gerada ?? a.commission ?? 0),
        date: a.data || a.date || '',
        data: a.data || a.date || '',
        time: a.horario || a.time || '',
        horario: a.horario || a.time || '',
        status: a.status || 'agendado',
        paymentStatus: a.status_pagamento || a.paymentStatus || 'pendente',
        status_pagamento: a.status_pagamento || a.paymentStatus || 'pendente',
        paymentMethod: a.forma_pagamento || a.paymentMethod || 'dinheiro',
        forma_pagamento: a.forma_pagamento || a.paymentMethod || 'dinheiro',
        isFiado: Boolean(a.is_fiado ?? a.isFiado ?? false),
        is_fiado: Boolean(a.is_fiado ?? a.isFiado ?? false),
        createdAt: a.criado_at || a.createdAt || new Date().toISOString(),
        criado_at: a.criado_at || a.createdAt || new Date().toISOString()
    }));

    console.log('\n🎉 =====================================================');
    console.log('🎉 MIGRAÇÃO CONCLUÍDA COM SUCESSO NO FIREBASE!');
    console.log('🎉 =====================================================');
}

executarMigracao()
    .then(() => setTimeout(() => process.exit(0), 1000))
    .catch((err) => {
        console.error('❌ Falha na migração:', err);
        process.exit(1);
    });
