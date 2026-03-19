-- Arquivo de Back-end: Schema do Banco de Dados Supabase (PostgreSQL)

-- 1. Tabela de Usuários
CREATE TABLE usuarios (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  funcao TEXT NOT NULL DEFAULT 'client', -- 'admin', 'barber', 'client'
  telefone TEXT,
  foto_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Tabela de Barbeiros (vinculada a um Usuário)
CREATE TABLE barbeiros (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  especialidade TEXT,
  comissao NUMERIC(5, 2) DEFAULT 40.0,
  avaliacao NUMERIC(3, 2) DEFAULT 5.0,
  total_avaliacoes INTEGER DEFAULT 0,
  foto_url TEXT,
  horarios_trabalho TEXT DEFAULT '08:00 às 19:00',
  ativo BOOLEAN DEFAULT true,
  horarios_bloqueados JSONB DEFAULT '[]'::JSONB,
  feriados JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Serviços
CREATE TABLE servicos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10, 2) NOT NULL,
  duracao TEXT NOT NULL, -- Ex: '30 min'
  icone TEXT,
  popular BOOLEAN DEFAULT false,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Agendamentos
CREATE TABLE agendamentos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES usuarios(id),
  barbeiro_id UUID REFERENCES barbeiros(id),
  servico_id UUID REFERENCES servicos(id),
  nome_cliente TEXT,
  nome_barbeiro TEXT,
  nome_servico TEXT,
  valor NUMERIC(10, 2),
  comissao_gerada NUMERIC(10, 2),
  data DATE NOT NULL,
  horario TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'agendado', -- 'agendado', 'confirmado', 'concluido', 'cancelado'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Tabela de Promoções
CREATE TABLE promocoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tag TEXT,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco NUMERIC(10, 2),
  gradiente_cor TEXT,
  accent_bg TEXT,
  texto_cor TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. Tabela de Estoque (Produtos)
CREATE TABLE estoque (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  categoria TEXT,
  preco NUMERIC(10, 2) NOT NULL,
  quantidade INTEGER DEFAULT 0,
  minimo INTEGER DEFAULT 5,
  imagem TEXT,
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 7. Tabela de Configurações da Loja
CREATE TABLE configuracoes_loja (
  id INTEGER PRIMARY KEY DEFAULT 1,
  nome TEXT NOT NULL,
  logo TEXT,
  endereco TEXT,
  telefone TEXT,
  whatsapp TEXT,
  email TEXT,
  horarios_funcionamento JSONB,
  redes_sociais JSONB,
  horarios_bloqueados JSONB DEFAULT '[]'::JSONB,
  feriados JSONB DEFAULT '[]'::JSONB,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 8. Tabela de Despesas
CREATE TABLE despesas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 9. Tabela de Entradas Avulsas
CREATE TABLE entradas_avulsas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value NUMERIC(10, 2) NOT NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 10. Tabela de Notificações
CREATE TABLE notificacoes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  usuario_id UUID REFERENCES usuarios(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  tipo TEXT, -- 'novo_agendamento', 'cancelamento', etc.
  lida BOOLEAN DEFAULT false,
  referencia_id UUID, -- ID do agendamento, por exemplo
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Policiamento de Segurança (RLS) - Exemplo simples aberto para desenvolvimento
-- Aplicar para todas as tabelas conforme necessário:
-- ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir acesso total" ON agendamentos FOR ALL USING (true) WITH CHECK (true);
-- ALTER TABLE notificacoes ENABLE ROW LEVEL SECURITY;
-- CREATE POLICY "Permitir acesso total" ON notificacoes FOR ALL USING (true) WITH CHECK (true);
