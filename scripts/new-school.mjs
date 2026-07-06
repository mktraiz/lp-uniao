import fs from "node:fs/promises";
import path from "node:path";

const [, , brandSlug, schoolSlug] = process.argv;

if (!brandSlug || !schoolSlug) {
  console.error("Uso: npm run new:school -- <slug-da-marca> <slug-da-escola>");
  process.exit(1);
}

const root = process.cwd();
const targetDir = path.join(root, "landing-pages", "marcas", brandSlug, "escolas", schoolSlug);

const files = {
  "README.md": `# ${schoolSlug}\n\nPasta de trabalho da escola.\n\nPreencha os arquivos em \`lp-captacao\` e \`lp-campanha\` antes de montar a pagina final.\n`,
  "lp-captacao/brief.md": "# LP captacao\n\n## Objetivo\n\n## Publico\n\n## Oferta\n\n## Diferenciais\n\n## CTA\n",
  "lp-captacao/copy.md": "# Copy da LP captacao\n\n## Hero\n\n## Secoes\n\n## FAQ\n",
  "lp-captacao/assets/.gitkeep": "",
  "lp-campanha/brief.md": "# LP campanha\n\n## Objetivo\n\n## Publico\n\n## Oferta\n\n## Diferenciais\n\n## CTA\n",
  "lp-campanha/copy.md": "# Copy da LP campanha\n\n## Hero\n\n## Secoes\n\n## FAQ\n",
  "lp-campanha/assets/.gitkeep": ""
};

for (const [relativePath, content] of Object.entries(files)) {
  const filePath = path.join(targetDir, relativePath);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, content, { flag: "wx" }).catch((error) => {
    if (error.code !== "EEXIST") throw error;
  });
}

console.log(`Pasta criada: ${targetDir}`);
