-- Apaga políticas antigas e cria novas com permissão total
-- Cole isso no SQL Editor do Supabase e clique Run

-- configuracoes_loja
DROP POLICY IF EXISTS "Escrita configuracoes" ON configuracoes_loja;
DROP POLICY IF EXISTS "Leitura publica configuracoes" ON configuracoes_loja;
CREATE POLICY "Allow all configuracoes_loja" ON configuracoes_loja FOR ALL USING (true) WITH CHECK (true);

-- barbeiros
DROP POLICY IF EXISTS "Escrita barbeiros" ON barbeiros;
DROP POLICY IF EXISTS "Leitura publica barbeiros" ON barbeiros;
CREATE POLICY "Allow all barbeiros" ON barbeiros FOR ALL USING (true) WITH CHECK (true);

-- agendamentos
DROP POLICY IF EXISTS "Escrita agendamentos" ON agendamentos;
DROP POLICY IF EXISTS "Leitura publica agendamentos" ON agendamentos;
CREATE POLICY "Allow all agendamentos" ON agendamentos FOR ALL USING (true) WITH CHECK (true);

-- usuarios
DROP POLICY IF EXISTS "Escrita usuarios" ON usuarios;
DROP POLICY IF EXISTS "Leitura publica usuarios" ON usuarios;
CREATE POLICY "Allow all usuarios" ON usuarios FOR ALL USING (true) WITH CHECK (true);

-- servicos (caso exista a tabela)
DROP POLICY IF EXISTS "Escrita servicos" ON servicos;
DROP POLICY IF EXISTS "Leitura publica servicos" ON servicos;
CREATE POLICY "Allow all servicos" ON servicos FOR ALL USING (true) WITH CHECK (true);
