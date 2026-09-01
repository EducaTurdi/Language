# 🦖 EducaTurdi

Plataforma escolar completa — **Next.js 14 + TypeScript + Tailwind**, autenticação
e banco de dados no **Supabase**, pronta para hospedar de graça na **Vercel**.

---

## 1. Banco de dados (Supabase)

Rode os arquivos SQL **nesta ordem**, no SQL Editor do seu projeto Supabase:

1. O schema base que você já tem (tabelas `profiles`, `turmas`, `tarefas`,
   `entregas`, `apostilas`, `resumos`, `notas`, `comunicados`, etc.).
2. [`supabase/schema_v2_hierarquia.sql`](./supabase/schema_v2_hierarquia.sql)
   → adiciona escolas, nível de inglês, meta mensal de pontos, notificações
   automáticas e todas as políticas de RLS (admin / colaborador / professor / aluno).
3. [`supabase/schema_v3_ajustes.sql`](./supabase/schema_v3_ajustes.sql)
   → pequenos ajustes de unicidade que o site usa.

Depois, em **Project Settings → API**, copie:
- **Project URL** e **anon public key** → variáveis `NEXT_PUBLIC_*`
- **service_role key** → variável `SUPABASE_SERVICE_ROLE_KEY` (fica só no
  servidor; é o que permite o admin/professor criar contas e redefinir senhas)

```bash
cp .env.example .env.local
# preencha as 3 variáveis
```

## 2. Rodando localmente

```bash
npm install
npm run dev
```

## 3. Criando o primeiro admin

Não existe cadastro público — só login. Para criar **o seu** usuário admin:

1. Em Supabase, vá em **Authentication → Users → Add user**, crie seu e-mail/senha.
2. No **SQL Editor**, rode:
   ```sql
   insert into public.profiles (id, nome, tipo, primeiro_acesso)
   values ('COLE-O-UUID-DO-USUARIO-AQUI', 'Seu Nome', 'admin', false);
   ```
   (o admin não passa pela tela de boas-vindas)
3. Pronto — faça login normalmente em `/login`.

Todo o resto (escolas, turmas, professores, colaboradores, alunos) é criado
**de dentro do site**, pelo próprio admin.

## 4. Publicando no GitHub + Vercel

```bash
git init && git add . && git commit -m "EducaTurdi"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

Na Vercel: **Add New → Project**, selecione o repositório, adicione as 3
variáveis de ambiente (as mesmas do `.env.local`) e clique em **Deploy**.

---

## Como funciona a hierarquia

```
Admin (só você)
 └─ Escola (ex: Escola Geraldinho)
     ├─ Colaboradores (Direção, Coordenação... — gerenciam a escola toda)
     ├─ Turma (ex: 9º Ano A)
     │   └─ Professor(es) vinculado(s) — só enxerga(m) a própria turma
     │       └─ Alunos daquela turma — só fazem tarefas, veem materiais e notas
```

| Papel | O que vê / faz |
|---|---|
| **Admin** | Tudo: todas as escolas, turmas, usuários. Único acesso sem onboarding. |
| **Colaborador** | Só a própria escola: cria/edita turmas, professores e alunos dela. |
| **Professor** | Só a(s) própria(s) turma(s): cria tarefas, apostilas, resumos, lança notas, cria/gerencia os alunos daquela turma, redefine senha deles. |
| **Aluno** | Só o próprio conteúdo: faz tarefas, vê materiais, vê o próprio boletim e desempenho. |

Tudo isso é garantido por **RLS no banco** (não só na interface) — mesmo que
alguém troque a URL, o Supabase bloqueia o que não é permitido para aquele
usuário.

## Meta mensal de pontos

A meta de cada aluno, em cada mês, é **(dias do mês) − 5**. Ex.: mês com 31
dias → meta de 26 pontos. Os pontos vêm das tarefas entregues e corrigidas
(`nota_obtida`). Sempre que uma entrega é corrigida, o banco recalcula
automaticamente e, se o aluno cair abaixo da meta, **avisa o(s) professor(es)
da turma** (ícone de sino no topo da tela).

## Primeiro acesso

Quando alguém loga pela primeira vez (`primeiro_acesso = true`), cai numa
tela de boas-vindas simples pedindo só a confirmação do nome — o papel
(aluno/professor/colaborador) já foi definido por quem criou a conta. Depois
disso, `primeiro_acesso` vira `false` e a tela nunca mais aparece. O admin
nunca passa por essa tela.

Em **Configurações** (ícone de engrenagem), qualquer pessoa pode, se quiser,
trocar e-mail e/ou senha — mas nada disso é obrigatório.

## Modo claro/escuro e o mascote Rex

- O alternador de tema (☀️/🌙) fica no topo, ao lado do sino de notificações,
  em todas as páginas logadas. A preferência é salva num cookie, então o
  próprio servidor já entrega a página no tema certo (sem "flash").
- O Rex (dinossauro mascote) aparece:
  - grande e animado na home e na tela de login/onboarding;
  - como um botão flutuante no canto da tela em **todas** as páginas
    (clique nele para uma dica rápida).

## Estrutura do projeto

```
app/
  page.tsx                    → landing pública
  login/                      → login (sem cadastro público)
  onboarding/                 → boas-vindas no primeiro acesso
  configuracoes/              → trocar e-mail/senha (opcional)
  painel/
    layout.tsx                → navbar + trava de onboarding
    page.tsx                  → redireciona conforme o papel do usuário
    admin/                    → admin e colaborador (escolas, turmas, usuários)
    turma/                    → "Painel da Turma" do professor
    aluno/                    → área do aluno
  api/admin/
    criar-usuario/            → cria contas (usa a service_role key)
    resetar-senha/            → redefine senhas
components/                    → Mascote, navbar, formulários, seletor de turma...
lib/
  actions/                     → server actions (tarefas, notas, materiais, turmas)
  data/                        → helpers de consulta (turma do professor/aluno)
  supabase/                    → clientes (browser, servidor, admin, middleware)
supabase/                      → migrações SQL
```

## O que ainda não está incluso (próximos passos)

- Provas com correção automática (as tabelas `provas`/`questoes`/`opcoes` já
  existem no banco, prontas para uma tela de prova cronometrada no futuro).
- Upload de arquivo direto (hoje apostilas/resumos usam um link — ex.: Google
  Drive. Dá pra evoluir para o Supabase Storage depois).
- Horários de aula e fichas disciplinares (tabelas já existem, sem tela ainda).
