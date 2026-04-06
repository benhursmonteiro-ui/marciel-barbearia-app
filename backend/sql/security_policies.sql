-- ==========================================
-- 1. Ativando RLS em todas as tabelas
-- ==========================================
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE promocoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE estoque ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracoes_loja ENABLE ROW LEVEL SECURITY;
ALTER TABLE despesas ENABLE ROW LEVEL SECURITY;
ALTER TABLE entradas_avulsas ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- 2. Políticas para a tabela USUÁRIOS
-- ==========================================

-- Admins podem fazer tudo
CREATE POLICY "Admins total control users" ON usuarios
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN (SELECT email FROM usuarios WHERE funcao = 'admin'))
WITH CHECK (true);

-- Usuários podem ver seus próprios dados
CREATE POLICY "Users can view own data" ON usuarios
FOR SELECT TO authenticated
USING (auth.jwt() ->> 'email' = email);

-- Permitir leitura básica de nomes de barbeiros para agendamento
CREATE POLICY "Public can view barber info from users" ON usuarios
FOR SELECT TO authenticated
USING (funcao = 'barber');


-- ==========================================
-- 3. Políticas para AGENDAMENTOS
-- ==========================================

-- Admins podem ver todos
CREATE POLICY "Admins can view all appointments" ON agendamentos
FOR ALL TO authenticated
USING (auth.jwt() ->> 'email' IN (SELECT email FROM usuarios WHERE funcao = 'admin'));

-- Clientes podem ver seus próprios agendamentos
CREATE POLICY "Clients view own appointments" ON agendamentos
FOR ALL TO authenticated
USING (cliente_id IN (SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email' AND funcao = 'client'));

-- Barbeiros podem ver seus agendamentos
CREATE POLICY "Barbers view own appointments" ON agendamentos
FOR ALL TO authenticated
USING (barbeiro_id IN (SELECT b.id FROM barbeiros b JOIN usuarios u ON b.usuario_id = u.id WHERE u.email = auth.jwt() ->> 'email'));


-- ==========================================
-- 4. Políticas para SERVIÇOS (Aberto para leitura, Admin para escrita)
-- ==========================================
CREATE POLICY "Everyone can view services" ON servicos FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage services" ON servicos FOR ALL TO authenticated 
USING (auth.jwt() ->> 'email' IN (SELECT email FROM usuarios WHERE funcao = 'admin'));


-- ==========================================
-- 5. Políticas para NOTIFICAÇÕES
-- ==========================================
CREATE POLICY "Users can see own notifications" ON notificacoes
FOR SELECT TO authenticated
USING (usuario_id IN (SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email'));

CREATE POLICY "Users can update own notifications" ON notificacoes
FOR UPDATE TO authenticated
USING (usuario_id IN (SELECT id FROM usuarios WHERE email = auth.jwt() ->> 'email'));


-- ==========================================
-- IMPORTANTE: Para que o RLS funcione com auth.jwt(),
-- todos os usuários devem estar cadastrados no Supabase Auth.
-- Atualmente o sistema usa uma tabela customizada. Recomenda-se migrar.
-- ==========================================
