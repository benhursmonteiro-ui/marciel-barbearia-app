CREATE TABLE IF NOT EXISTS public.usuarios (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    nome text NOT NULL,
    email text NOT NULL UNIQUE,
    senha text NOT NULL,
    funcao text DEFAULT 'cliente'::text,
    telefone text,
    foto_url text,
    perfil_completo boolean DEFAULT false,
    criado_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.barbeiros (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    usuario_id uuid REFERENCES public.usuarios(id),
    nome text NOT NULL,
    especialidade text,
    foto_url text,
    biografia text,
    comissao numeric DEFAULT 30.0,
    ativo boolean DEFAULT true,
    criado_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.servicos (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    nome text NOT NULL,
    descricao text,
    preco numeric NOT NULL,
    duracao integer NOT NULL, -- em minutos
    ativo boolean DEFAULT true,
    categoria text,
    foto_url text,
    criado_at timestamp with time zone DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.agendamentos (
    id uuid DEFAULT gen_random_uuid() NOT NULL PRIMARY KEY,
    cliente_id uuid REFERENCES public.usuarios(id),
    barbeiro_id uuid REFERENCES public.barbeiros(id),
    servico_id uuid REFERENCES public.servicos(id),
    data date NOT NULL,
    horario time without time zone NOT NULL,
    status text DEFAULT 'pendente'::text,
    nome_cliente text,
    nome_servico text,
    preco_servico numeric,
    finalizado boolean DEFAULT false,
    total_pago numeric DEFAULT 0.0,
    criado_at timestamp with time zone DEFAULT now()
);

-- Adicione mais tabelas (notificacoes, estoque, etc.) conforme seu schema original.
