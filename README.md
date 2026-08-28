# 🦖 EducaTurdi *Languages*

Uma plataforma para aprender **inglês** e **programação** de um jeito interativo e gamificado — com trilhas, lições, XP, ofensiva (streak), vidas e o **Rex**, o dinossauro mascote.

Feita em **Next.js 14 + TypeScript + Tailwind CSS**, com autenticação e banco de dados no **Supabase**, pronta para hospedar de graça na **Vercel**.

---

## 1. Rodando localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

## 2. Configurando o Supabase (grátis)

1. Crie uma conta em [supabase.com](https://supabase.com) e um novo projeto (plano Free).
2. Vá em **SQL Editor** → **New query**, cole todo o conteúdo do arquivo [`supabase/schema.sql`](./supabase/schema.sql) e clique em **Run**. Isso cria:
   - a tabela `profiles` (username, XP, ofensiva, vidas);
   - a tabela `lesson_progress` (lições concluídas);
   - as políticas de segurança (RLS) para cada usuário só ver/editar os próprios dados;
   - um gatilho que cria o perfil automaticamente quando alguém se cadastra.
3. Vá em **Project Settings → API** e copie a **Project URL** e a **anon public key**.
4. Copie o arquivo `.env.example` para `.env.local` e cole os valores:

```bash
cp .env.example .env.local
```

```
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

5. (Opcional) Em **Authentication → Providers → Email**, você pode desativar a confirmação por e-mail para testar mais rápido, ou deixar ativada para produção.

## 3. Publicando no GitHub

```bash
git init
git add .
git commit -m "EducaTurdi Languages"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

## 4. Hospedando de graça na Vercel

1. Acesse [vercel.com](https://vercel.com), faça login com o GitHub e clique em **Add New → Project**.
2. Selecione o repositório que você acabou de subir.
3. Em **Environment Variables**, adicione as mesmas duas variáveis do `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Clique em **Deploy**. Pronto — seu site estará no ar em um domínio gratuito `.vercel.app`.

## Estrutura do projeto

```
app/
  page.tsx                 → landing page
  login/, signup/          → autenticação
  auth/callback/           → confirmação de e-mail
  dashboard/               → área logada
    page.tsx               → trilhas (Inglês / Programação)
    course/[trackId]/      → caminho de lições de uma trilha
    lesson/[lessonId]/     → exercícios interativos
    profile/               → estatísticas do usuário
components/                → Mascote, cartões, barra de XP, player de lição...
lib/
  data/tracks.ts           → todo o conteúdo das lições (edite/adicione aqui!)
  supabase/                → clientes do Supabase (browser, servidor, middleware)
supabase/schema.sql         → esquema do banco de dados
```

## Adicionando novas lições

Todo o conteúdo educacional fica em [`lib/data/tracks.ts`](./lib/data/tracks.ts). Cada trilha tem unidades, cada unidade tem lições, e cada lição tem exercícios de três tipos:

- `mcq` → múltipla escolha
- `text` → resposta digitada
- `order` → organizar palavras na ordem certa

Basta seguir o mesmo formato para criar novas unidades, lições ou até novas trilhas.

---

Feito com 🧡 para a comunidade **EducaTurdi**.
