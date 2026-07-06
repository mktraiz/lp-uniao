import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const schoolsDir = path.join(root, "content", "schools");
const templatePath = path.join(root, "templates", "base.html");
const distDir = path.join(root, "dist");

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const render = (template, replacements) => {
  let output = template;

  for (const [key, value] of Object.entries(replacements)) {
    output = output.replaceAll(`{{${key}}}`, value);
  }

  return output;
};

const ctaHrefFor = (lp) => {
  if (lp.whatsapp) {
    const clean = String(lp.whatsapp).replace(/\D/g, "");
    return clean ? `https://wa.me/${clean}` : lp.whatsapp;
  }

  return "#contato";
};

async function build() {
  const template = await fs.readFile(templatePath, "utf8");
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(distDir, { recursive: true });

  const files = (await fs.readdir(schoolsDir)).filter((file) => file.endsWith(".json"));

  for (const file of files) {
    const schoolConfig = JSON.parse(await fs.readFile(path.join(schoolsDir, file), "utf8"));

    for (const lp of schoolConfig.lps) {
      const pageDir = path.join(
        distDir,
        schoolConfig.brand.slug,
        schoolConfig.school.slug,
        lp.type
      );

      const highlights = (lp.highlights || [])
        .map((item) => `<div class="item">${escapeHtml(item)}</div>`)
        .join("\n            ");

      const html = render(template, {
        brandName: escapeHtml(schoolConfig.brand.name),
        schoolName: escapeHtml(schoolConfig.school.name),
        city: escapeHtml(schoolConfig.school.city),
        state: escapeHtml(schoolConfig.school.state),
        title: escapeHtml(lp.title),
        subtitle: escapeHtml(lp.subtitle),
        cta: escapeHtml(lp.cta),
        ctaHref: escapeHtml(ctaHrefFor(lp)),
        highlights,
        primaryColor: schoolConfig.primaryColor || "#0F6B5F",
        secondaryColor: schoolConfig.secondaryColor || "#F5B84B"
      });

      await fs.mkdir(pageDir, { recursive: true });
      await fs.writeFile(path.join(pageDir, "index.html"), html);
    }
  }

  await fs.writeFile(
    path.join(distDir, "index.html"),
    "<!doctype html><html lang=\"pt-BR\"><meta charset=\"utf-8\"><title>LPs RAIZ Educacao</title><body><h1>LPs RAIZ Educacao</h1><p>Build gerado com sucesso.</p></body></html>"
  );

  console.log(`Build finalizado: ${files.length} escola(s) processada(s).`);
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
