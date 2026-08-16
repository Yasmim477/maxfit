import { access, readFile, stat } from "node:fs/promises";
import { join } from "node:path";

const sourceRoot = new URL("..", import.meta.url).pathname;
const repoRoot = new URL("../..", import.meta.url).pathname;
const indexPath = join(repoRoot, "index.html");
const catalogPath = join(sourceRoot, "app/catalog.ts");
const migrationPath = join(repoRoot, "supabase/migrations/20260816090000_expand_maxfit_catalog.sql");

const [html, catalog, migration, htmlStats] = await Promise.all([
  readFile(indexPath, "utf8"),
  readFile(catalogPath, "utf8"),
  readFile(migrationPath, "utf8"),
  stat(indexPath),
]);

const assert = (condition, message) => {
  if (!condition) throw new Error(message);
};

assert(html.includes("https://ewibqlguwibhyzkdjpac.supabase.co"), "Projeto Supabase esperado não encontrado");
assert(!/service_role/i.test(html), "Uma chave service_role não pode aparecer no site");
assert(html.includes("<style>") && html.includes("<script type=\"module\">"), "CSS ou JavaScript não foram incorporados");
assert(htmlStats.size < 700_000, "O HTML ultrapassou o limite de 700 KB");
assert((catalog.match(/product\(\{ id:/g) || []).length === 46, "O catálogo local deve conter 46 SKUs");
assert(migration.includes("add column family_slug"), "Migração de famílias ausente");
assert(!/delete\s+from\s+(?:auth\.)?users/i.test(migration), "A migração não pode apagar usuários");

const imagePaths = [...new Set([...catalog.matchAll(/\/assets\/images\/([a-z0-9-]+\.webp)/g)].map((match) => match[1]))];
assert(imagePaths.length === 10, `Esperadas 10 imagens de catálogo, encontradas ${imagePaths.length}`);

await Promise.all(imagePaths.map((name) => access(join(repoRoot, "assets/images", name))));
await access(join(repoRoot, "assets/images/maxfit-hero.webp"));

console.log(`Verificação concluída: 46 SKUs, ${imagePaths.length + 1} imagens e HTML de ${(htmlStats.size / 1024).toFixed(0)} KB.`);
