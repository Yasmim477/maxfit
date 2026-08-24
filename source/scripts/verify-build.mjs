import { access, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const sourceRoot = new URL("..", import.meta.url).pathname;
const repoRoot = new URL("../..", import.meta.url).pathname;
const indexPath = join(repoRoot, "index.html");
const catalogPath = join(sourceRoot, "app/catalog.ts");
const migrationPath = join(repoRoot, "supabase/migrations/20260816090000_expand_maxfit_catalog.sql");
const checkoutMigrationPath = join(repoRoot, "supabase/migrations/20260824180000_add_professional_checkout.sql");

const [html, catalog, migration, checkoutMigration, htmlStats] = await Promise.all([
  readFile(indexPath, "utf8"),
  readFile(catalogPath, "utf8"),
  readFile(migrationPath, "utf8"),
  readFile(checkoutMigrationPath, "utf8"),
  stat(indexPath),
]);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(html.includes("https://ewibqlguwibhyzkdjpac.supabase.co"), "Projeto Supabase esperado não encontrado");
assert(!/service_role/i.test(html), "Uma chave service_role não pode aparecer no site");
assert(html.includes("<style>") && html.includes("<script type=\"module\">"), "CSS ou JavaScript não foram incorporados");
assert((html.match(/<!doctype html>/gi) || []).length === 1, "O HTML final contém documentos duplicados");
assert((html.match(/<html\b/gi) || []).length === 1, "O HTML final contém mais de uma raiz HTML");
assert((html.match(/<div id=\"root\"><\/div>/g) || []).length === 1, "A raiz React deve aparecer uma única vez");
assert(htmlStats.size < 700_000, "O HTML ultrapassou o limite de 700 KB");
assert((catalog.match(/product\(\{ id:/g) || []).length === 46, "O catálogo local deve conter 46 SKUs");
assert(migration.includes("add column family_slug"), "Migração de famílias ausente");
assert(!/delete\s+from\s+(?:auth\.)?users/i.test(migration), "A migração não pode apagar usuários");
assert(html.includes("Minhas compras"), "A área de compras não foi incluída no site");
assert(html.includes("pix@maxfit.example"), "A chave PIX fictícia não foi incluída");
assert(html.includes("Endereço de entrega"), "O checkout não contém a etapa de endereço");
assert(checkoutMigration.includes("create table public.customer_addresses"), "Tabela de endereços ausente");
assert(checkoutMigration.includes("private.checkout_cart_internal"), "Checkout transacional ausente");
assert(checkoutMigration.includes("security definer") && checkoutMigration.includes("set search_path = ''"), "Função privilegiada sem proteção de search_path");
assert(checkoutMigration.includes("revoke insert on table public.orders from authenticated"), "Pedidos ainda podem ser inseridos diretamente pelo navegador");
assert(!/service_role/i.test(checkoutMigration), "A migração não pode depender de chave service_role");

const imagePaths = [...new Set([...catalog.matchAll(/\/assets\/images\/([a-z0-9-]+\.webp)/g)].map((match) => match[1]))];
assert(imagePaths.length === 10, `Esperadas 10 imagens de catálogo, encontradas ${imagePaths.length}`);

await Promise.all(imagePaths.map((name) => access(join(repoRoot, "assets/images", name))));
await access(join(repoRoot, "assets/images/maxfit-hero.webp"));

console.log(`Verificação concluída: checkout, histórico, 46 SKUs, ${imagePaths.length + 1} imagens e HTML de ${(htmlStats.size / 1024).toFixed(0)} KB.`);
