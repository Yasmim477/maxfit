import { readFile, writeFile } from "node:fs/promises";
import { basename, join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const dist = join(root, "dist-pages");
const imageDir = "/tmp/maxfit-web-images";

const html = await readFile(join(dist, "index.html"), "utf8");
const cssPath = html.match(/href="\/maxfit\/(assets\/[^\"]+\.css)"/)?.[1];
const jsPath = html.match(/src="\/maxfit\/(assets\/[^\"]+\.js)"/)?.[1];

if (!cssPath || !jsPath) throw new Error("Arquivos gerados não encontrados");

const [css, js] = await Promise.all([
  readFile(join(dist, cssPath), "utf8"),
  readFile(join(dist, jsPath), "utf8"),
]);

const imageNames = [
  "maxfit-accessories.png",
  "maxfit-hero.png",
  "maxfit-supplements.png",
  "product-creatine.png",
  "product-preworkout.png",
  "product-shaker.png",
  "product-snacks.png",
  "product-vitamins.png",
  "product-whey.png",
];

const assets = {};
for (const name of imageNames) {
  const optimizedName = `${basename(name, ".png")}.webp`;
  const bytes = await readFile(join(imageDir, optimizedName));
  assets[`images/${name}`] = `data:image/webp;base64,${bytes.toString("base64")}`;
}

const output = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0f140c" />
    <meta name="description" content="Maxfit: suplementos, acessórios e itens fitness com catálogo, login e carrinho." />
    <title>Maxfit | Suplementos e acessórios para sua evolução</title>
    <style>${css}</style>
  </head>
  <body>
    <div id="root"></div>
    <script>window.__MAXFIT_ASSETS__=${JSON.stringify(assets)};</script>
    <script type="module">${js}\n//# sourceURL=maxfit-app.js</script>
  </body>
</html>`;

await writeFile(join(root, "maxfit-github-pages.html"), output);
console.log(`Arquivo único criado (${(Buffer.byteLength(output) / 1024 / 1024).toFixed(1)} MB)`);
