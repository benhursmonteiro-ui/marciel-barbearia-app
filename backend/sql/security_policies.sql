-- 1. Ativar o RLS (Segurança de Linha) em todas as tabelas
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE barbeiros ENABLE ROW LEVEL SECURITY;
ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;

-- 2. Limpar qualquer segurança anterior
DROP POLICY IF EXISTS "Leitura publica login" ON usuarios;
DROP POLICY IF EXISTS "Permitir apenas Login" ON usuarios;

-- 3. Função RPC para Login Seguro (Protegida)
CREATE OR REPLACE FUNCTION public.login_user(p_email text, p_password text)
RETURNS SETOF public.usuarios
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT * FROM public.usuarios 
  WHERE email = p_email AND senha = p_password;
END;
$$;

GRANT EXECUTE ON FUNCTION public.login_user(text, text) TO anon, authenticated, public;

-- 4. Regra para novos cadastros (INSERT)
CREATE POLICY "Public can register" ON usuarios
FOR INSERT
WITH CHECK (true);

-- 5. Regra para os próprios usuários lerem seus perfis (Login com Google/Dashboard)
CREATE POLICY "Users view own profile" ON usuarios
FOR SELECT
TO authenticated, anon
USING (email = (auth.jwt() ->> 'email'));

-- 6. Regras de Administrador (Ver Tudo)
CREATE POLICY "Admins full control" ON usuarios
FOR ALL 
TO authenticated
USING (auth.jwt() ->> 'email' IN (SELECT email FROM usuarios WHERE funcao = 'admin'));

-- 7. Visibilidade das telas iniciais
CREATE POLICY "Leitura pública serviços" ON servicos FOR SELECT USING (true);
CREATE POLICY "Leitura pública barbeiros" ON barbeiros FOR SELECT USING (true);
