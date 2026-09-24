import { db } from '@/lib/firebase';
import { collection, getDocs, doc, writeBatch } from 'firebase/firestore';

/**
 * Função para apagar do Firebase os agendamentos antigos.
 * Por padrão, remove agendamentos com data anterior a 15 dias atrás.
 * 
 * @param diasLimite Número de dias passados para considerar o agendamento antigo (padrão: 15)
 * @returns Retorna a quantidade de agendamentos deletados.
 */
export async function apagarAgendamentosAntigos(diasLimite: number = 15): Promise<number> {
    try {
        const dataLimite = new Date();
        dataLimite.setDate(dataLimite.getDate() - diasLimite);
        const dataLimiteStr = dataLimite.toISOString().split('T')[0];

        const snapshot = await getDocs(collection(db, 'agendamentos'));
        const docsParaApagar: string[] = [];

        snapshot.forEach(docSnap => {
            const d = docSnap.data();
            const dataDoc = d.date || d.data || '';
            if (dataDoc && dataDoc < dataLimiteStr) {
                docsParaApagar.push(docSnap.id);
            }
        });

        if (docsParaApagar.length === 0) {
            console.log(`[Firebase Limpeza] Nenhum agendamento com mais de ${diasLimite} dias encontrado.`);
            return 0;
        }

        const BATCH_SIZE = 400;
        for (let i = 0; i < docsParaApagar.length; i += BATCH_SIZE) {
            const batch = writeBatch(db);
            const chunk = docsParaApagar.slice(i, i + BATCH_SIZE);
            for (const id of chunk) {
                batch.delete(doc(db, 'agendamentos', id));
            }
            await batch.commit();
        }

        console.log(`[Firebase Limpeza] ${docsParaApagar.length} agendamento(s) com mais de ${diasLimite} dias apagado(s) com sucesso.`);
        return docsParaApagar.length;
    } catch (error) {
        console.error('[Firebase Limpeza] Falha na execução da limpeza:', error);
        throw error;
    }
}
