# Marciel BarberShop - Estrutura do Projeto

Este projeto foi organizado para separar as responsabilidades de Frontend e Backend.

## Estrutura de Pastas

- **`/frontend`**: Contém toda a aplicação Next.js (Interface, Contextos, Componentes e Lógica de Cliente).
- **`/backend`**: Contém os recursos do servidor e banco de dados (Scripts SQL, Schemas e Documentação do Supabase).

## Como rodar o projeto

### Frontend
Para iniciar a aplicação Next.js:
1. Abra o terminal na pasta `frontend`: `cd frontend`
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`

### Backend (Supabase)
O backend deste projeto é gerenciado pelo **Supabase**.
Os scripts para recriar ou atualizar o banco de dados estão em `/backend/sql/schema.sql`.
