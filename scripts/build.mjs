import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const schoolsDir = path.join(root, "content", "schools");
const pageTemplatePath = path.join(root, "templates", "page.html");
const tokensCssPath = path.join(root, "templates", "shared", "tokens.css");
const baseCssPath = path.join(root, "templates", "shared", "base.css");
const modelsDir = path.join(root, "templates", "models");
const distDir = path.join(root, "dist");
const allDir = path.join(distDir, "apps", "all");

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

const appIdFor = (schoolConfig, lp) =>
  lp.appId || `${schoolConfig.brand.slug}--${schoolConfig.school.slug}--${lp.type}`;

const domainFor = (schoolConfig, lp) => {
  if (lp.domain?.primary) return lp.domain.primary;
  if (lp.domain?.subdomain && schoolConfig.brand.domain) {
    return `${lp.domain.subdomain}.${schoolConfig.brand.domain}`;
  }

  return "";
};

const textFor = (value, fallback = "") => escapeHtml(value || fallback);

const csvValue = (value = "") => `"${String(value).replaceAll('"', '""')}"`;

const hubspotFor = (appId, lp) => {
  const portalId = lp.hubspot?.portalId || "";
  const formId = lp.hubspot?.formId || lp.formId || "";
  const region = lp.hubspot?.region || "na1";
  const target = `hubspot-form-${appId}`;

  if (!portalId || !formId) {
    return {
      form: `<div class="hubspot-placeholder">Formulario HubSpot pendente. Configure <strong>hubspot.portalId</strong> e <strong>hubspot.formId</strong> nesta LP.</div>`,
      script: "",
      configured: false
    };
  }

  return {
    form: `<div class="hubspot-slot" id="${target}"></div>`,
    script: `\n    <script src="https://js.hsforms.net/forms/embed/v2.js" charset="utf-8"></script>\n    <script>\n      hbspt.forms.create({ region: "${region}", portalId: "${portalId}", formId: "${formId}", target: "#${target}" });\n    </script>`,
    configured: true
  };
};

async function build() {
  const pageTemplate = await fs.readFile(pageTemplatePath, "utf8");
  const tokensCss = await fs.readFile(tokensCssPath, "utf8");
  const baseCss = await fs.readFile(baseCssPath, "utf8");
  await fs.rm(distDir, { recursive: true, force: true });
  await fs.mkdir(allDir, { recursive: true });

  const files = (await fs.readdir(schoolsDir)).filter((file) => file.endsWith(".json"));
  const manifest = [];
  const warnings = [];

  for (const file of files) {
    const schoolConfig = JSON.parse(await fs.readFile(path.join(schoolsDir, file), "utf8"));

    for (const lp of schoolConfig.lps) {
      const appId = appIdFor(schoolConfig, lp);
      const model = lp.model || "matriculas-premium";
      const modelPath = path.join(modelsDir, `${model}.html`);
      const pageDir = path.join(
        allDir,
        schoolConfig.brand.slug,
        schoolConfig.school.slug,
        lp.type
      );
      const appDir = path.join(distDir, "apps", appId);

      const highlights = (lp.highlights || [])
        .map((item) => `<div class="item">${escapeHtml(item)}</div>`)
        .join("\n            ");
      const modelHighlights = (lp.highlights || [])
        .map((item) => `<div class="proof-card">${escapeHtml(item)}</div>`)
        .join("\n            ");

      let modelTemplate;

      try {
        modelTemplate = await fs.readFile(modelPath, "utf8");
      } catch (error) {
        if (error.code !== "ENOENT") throw error;
        throw new Error(`Modelo nao encontrado para ${appId}: ${model}`);
      }

      const hubspot = hubspotFor(appId, lp);

      if (!hubspot.configured) {
        warnings.push(`${appId}: HubSpot pendente`);
      }

      const replacements = {
        brandName: escapeHtml(schoolConfig.brand.name),
        schoolName: escapeHtml(schoolConfig.school.name),
        city: escapeHtml(schoolConfig.school.city),
        state: escapeHtml(schoolConfig.school.state),
        title: escapeHtml(lp.title),
        subtitle: escapeHtml(lp.subtitle),
        cta: escapeHtml(lp.cta),
        ctaHref: escapeHtml(ctaHrefFor(lp)),
        highlights: modelHighlights || highlights,
        offer: textFor(lp.offer, lp.subtitle),
        statValue: textFor(lp.stat?.value, lp.type === "captacao" ? "2026" : "Agenda"),
        statLabel: textFor(lp.stat?.label, lp.type === "captacao" ? "Matriculas abertas" : "Inscricoes abertas"),
        eventDate: textFor(lp.event?.dateLabel, "Em breve"),
        hubspotForm: hubspot.form,
        primaryColor: schoolConfig.primaryColor || "#0F6B5F",
        secondaryColor: schoolConfig.secondaryColor || "#F5B84B"
      };

      const body = render(modelTemplate, replacements);
      const html = render(pageTemplate, {
        ...replacements,
        model,
        body,
        tokensCss: render(tokensCss, replacements),
        baseCss,
        hubspotScript: hubspot.script
      });

      await fs.mkdir(pageDir, { recursive: true });
      await fs.writeFile(path.join(pageDir, "index.html"), html);
      await fs.mkdir(appDir, { recursive: true });
      await fs.writeFile(path.join(appDir, "index.html"), html);

      manifest.push({
        appId,
        type: lp.type,
        brand: schoolConfig.brand.name,
        brandSlug: schoolConfig.brand.slug,
        brandDomain: schoolConfig.brand.domain || "",
        school: schoolConfig.school.name,
        schoolSlug: schoolConfig.school.slug,
        model,
        primaryDomain: domainFor(schoolConfig, lp),
        domainAliases: lp.domain?.aliases || [],
        hubspotConfigured: hubspot.configured,
        route: `/${schoolConfig.brand.slug}/${schoolConfig.school.slug}/${lp.type}/`,
        dist: `dist/apps/${appId}`
      });
    }
  }

  await fs.writeFile(
    path.join(allDir, "index.html"),
    "<!doctype html><html lang=\"pt-BR\"><meta charset=\"utf-8\"><title>LPs RAIZ Educacao</title><body><h1>LPs RAIZ Educacao</h1><p>Build gerado com sucesso.</p></body></html>"
  );
  await fs.writeFile(path.join(distDir, "apps-manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  await fs.writeFile(
    path.join(distDir, "easypanel-apps.csv"),
    [
      ["appId", "model", "primaryDomain", "domainAliases", "hubspotConfigured", "dist"]
        .map(csvValue)
        .join(","),
      ...manifest.map((item) =>
        [
          item.appId,
          item.model,
          item.primaryDomain,
          item.domainAliases.join(" "),
          item.hubspotConfigured,
          item.dist
        ]
          .map(csvValue)
          .join(",")
      )
    ].join("\n") + "\n"
  );

  console.log(`Build finalizado: ${manifest.length} LP(s) em ${files.length} escola(s).`);
  for (const warning of warnings) {
    console.warn(`Aviso: ${warning}`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
