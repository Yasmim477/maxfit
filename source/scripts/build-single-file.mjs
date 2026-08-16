import { readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

const sourceRoot = new URL("..", import.meta.url).pathname;
const repoRoot = new URL("../..", import.meta.url).pathname;
const dist = join(sourceRoot, "dist-pages");

const html = await readFile(join(dist, "index.html"), "utf8");
const cssPath = html.match(/href="\/maxfit\/(assets\/[^\"]+\.css)"/)?.[1];
const jsPath = html.match(/src="\/maxfit\/(assets\/[^\"]+\.js)"/)?.[1];

if (!cssPath || !jsPath) throw new Error("Arquivos gerados não encontrados");

const [css, js] = await Promise.all([
  readFile(join(dist, cssPath), "utf8"),
  readFile(join(dist, jsPath), "utf8"),
]);

const output = html
  .replace(/<link[^>]+href="\/maxfit\/assets\/[^\"]+\.css"[^>]*>/, `<style>${css}</style>`)
  .replace(/<script[^>]+src="\/maxfit\/assets\/[^\"]+\.js"[^>]*><\/script>/, `<script type="module">${js}\n//# sourceURL=maxfit-app.js</script>`)
  .replace(/[ \t]+$/gm, "");

await writeFile(join(repoRoot, "index.html"), output);
console.log(`Site do GitHub Pages criado (${(Buffer.byteLength(output) / 1024).toFixed(0)} KB)`);
