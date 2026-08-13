# Maxfit

Loja virtual de suplementos, acessórios e itens fitness criada para um trabalho escolar.

## Site público

O projeto é publicado automaticamente no GitHub Pages:

**https://joao9435531-dotcom.github.io/maxfit/**

## Funcionalidades

- catálogo profissional com 12 produtos carregados do Supabase;
- busca, categorias, ordenação e detalhes dos produtos;
- carrinho responsivo com cupom `MAX10` e cálculo de frete demonstrativo;
- cadastro, login e logout com Supabase Auth;
- carrinho sincronizado no banco para usuários conectados;
- pedidos demonstrativos registrados no banco;
- proteção por Row Level Security (RLS), para cada usuário acessar somente os próprios dados;
- layout adaptado para celular e computador.

## Tecnologias

- HTML, CSS, TypeScript e React;
- Supabase (Postgres + Auth);
- Vite;
- GitHub Actions e GitHub Pages.

## Segurança

O navegador usa somente a chave **publicável** do Supabase. Nenhuma chave `service_role` ou chave secreta faz parte deste repositório. As tabelas públicas usam políticas RLS.

## Desenvolvimento local

Requer Node.js 22 ou superior.

```bash
npm install
npm run dev:pages
```

Para gerar a versão do GitHub Pages:

```bash
npm run build:pages
```

O esquema do banco está documentado em `supabase/migrations/`.

## Observação escolar

O fluxo de pedido é uma demonstração acadêmica e não processa pagamentos reais.
