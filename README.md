# Maxfit

<div align="center">
  <h2>👥 Membros responsáveis</h2>
  <h1>Yasmim • Lorrane • Analice</h1>
  <h3>Turma 3001</h3>
</div>

---

Loja virtual de suplementos, acessórios e itens fitness criada para um trabalho escolar.

## Site público

O projeto é publicado automaticamente no GitHub Pages:

**https://yasmim477.github.io/maxfit/**

## Funcionalidades

- catálogo profissional com 21 linhas de produto e 46 opções de sabor, cor ou tamanho carregadas do Supabase;
- imagens originais e realistas da linha Maxfit, otimizadas em WebP;
- seletor de variações que adiciona ao carrinho o SKU escolhido;
- busca, categorias, ordenação e detalhes dos produtos;
- carrinho responsivo com cupom `MAX10` e cálculo de frete demonstrativo;
- cadastro, login e logout com Supabase Auth;
- carrinho sincronizado no banco para usuários conectados;
- pedidos demonstrativos registrados no banco;
- checkout em etapas com endereço de entrega salvo na conta;
- prazo de entrega simulado de acordo com o CEP informado;
- pagamento PIX totalmente fictício, sem movimentação de dinheiro;
- área **Minhas compras** com itens, valores, endereço, pagamento e previsão de entrega;
- criação transacional de pedidos no banco, com valores recalculados a partir do catálogo;
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

Requer Node.js 20 ou superior.

```bash
cd source
npm install
npm run dev
```

Para gerar a versão do GitHub Pages:

```bash
npm run test
```

O comando de teste compila o TypeScript, recria o `index.html` do GitHub Pages e valida o checkout, o catálogo, as imagens e a ausência de chaves secretas. O GitHub Actions executa essa validação antes de cada publicação.

> O checkout é acadêmico. A chave PIX usa o domínio reservado `.example` e não recebe pagamentos reais.

O esquema do banco está documentado em `supabase/migrations/`.

## Observação escolar

O fluxo de pedido é uma demonstração acadêmica e não processa pagamentos reais.
