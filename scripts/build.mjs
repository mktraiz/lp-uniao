import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const schoolsDir = path.join(root, "content", "schools");
const previewsPath = path.join(root, "content", "model-previews.json");
const pageTemplatePath = path.join(root, "templates", "page.html");
const tokensCssPath = path.join(root, "templates", "shared", "tokens.css");
const baseCssPath = path.join(root, "templates", "shared", "base.css");
const modelsDir = path.join(root, "templates", "models");
const distDir = path.join(root, "dist");
const allDir = path.join(distDir, "apps", "all");
const previewsDir = path.join(distDir, "previews");

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

  return "#formulario";
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
const cssUrlFor = (value = "") => String(value || "").replaceAll("\\", "").replaceAll("'", "%27").replaceAll("\"", "%22").replaceAll(")", "%29");
const renderContentCards = (items = [], className = "school-content-card") =>
  items
    .map(
      (item) =>
        `<article class="${className}"><h3>${escapeHtml(item.title || "")}</h3><p>${escapeHtml(item.text || "")}</p></article>`
    )
    .join("\n            ");

const hubspotFor = (appId, lp) => {
  const portalId = lp.hubspot?.portalId || "";
  const formId = lp.hubspot?.formId || lp.formId || "";
  const region = lp.hubspot?.region || "na1";
  const target = `hubspot-form-${appId}`;

  if (!portalId || !formId) {
    return {
      form: `<div class="hubspot-placeholder"><span>Formulario HubSpot pendente</span><p>Configure os campos abaixo nesta LP para ativar a captura.</p><code>hubspot.portalId</code><code>hubspot.formId</code></div>`,
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

async function renderLp({ schoolConfig, lp, appId, pageTemplate, tokensCss, baseCss }) {
  const model = lp.model || "matriculas-premium";
  const modelPath = path.join(modelsDir, `${model}.html`);
  const modelTemplate = await fs.readFile(modelPath, "utf8").catch((error) => {
    if (error.code !== "ENOENT") throw error;
    throw new Error(`Modelo nao encontrado para ${appId}: ${model}`);
  });

  const highlights = (lp.highlights || [])
    .map((item) => `<div class="proof-card">${escapeHtml(item)}</div>`)
    .join("\n            ");
  const hubspot = hubspotFor(appId, lp);
  const replacements = {
    brandName: escapeHtml(schoolConfig.brand.name),
    schoolName: escapeHtml(schoolConfig.school.name),
    city: escapeHtml(schoolConfig.school.city),
    state: escapeHtml(schoolConfig.school.state),
    title: escapeHtml(lp.title),
    subtitle: escapeHtml(lp.subtitle),
    seoTitle: escapeHtml(lp.seo?.title || `${lp.title} | ${schoolConfig.school.name}`),
    seoDescription: escapeHtml(lp.seo?.description || lp.subtitle),
    canonicalTag: lp.seo?.canonicalUrl ? `<link rel="canonical" href="${escapeHtml(lp.seo.canonicalUrl)}">` : "",
    cta: escapeHtml(lp.cta),
    ctaHref: escapeHtml(ctaHrefFor(lp)),
    highlights,
    offer: textFor(lp.offer, lp.subtitle),
    statValue: textFor(lp.stat?.value, lp.type === "captacao" ? "2026" : "Agenda"),
    statLabel: textFor(lp.stat?.label, lp.type === "captacao" ? "Matriculas abertas" : "Inscricoes abertas"),
    eventDate: textFor(lp.event?.dateLabel, "Em breve"),
    introTitle: textFor(lp.intro?.title, "Conheca a escola."),
    introText: textFor(lp.intro?.text, lp.offer || lp.subtitle),
    missionText: textFor(lp.mission, ""),
    address: textFor(lp.address, `${schoolConfig.school.city}/${schoolConfig.school.state}`),
    segmentCards: renderContentCards(lp.segments || [], "school-content-card"),
    differentialCards: renderContentCards(lp.differentials || [], "school-content-card school-content-card-strong"),
    heroImage: cssUrlFor(lp.media?.heroImage || ""),
    secondaryImage: cssUrlFor(lp.media?.secondaryImage || lp.media?.heroImage || ""),
    logoImage: cssUrlFor(lp.media?.logoImage || ""),
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

  return { html, model, hubspotConfigured: hubspot.configured };
}

async function buildApps({ pageTemplate, tokensCss, baseCss }) {
  await fs.mkdir(allDir, { recursive: true });

  const files = (await fs.readdir(schoolsDir)).filter((file) => file.endsWith(".json"));
  const manifest = [];
  const warnings = [];

  for (const file of files) {
    const schoolConfig = JSON.parse(await fs.readFile(path.join(schoolsDir, file), "utf8"));

    for (const lp of schoolConfig.lps) {
      const appId = appIdFor(schoolConfig, lp);
      const pageDir = path.join(allDir, schoolConfig.brand.slug, schoolConfig.school.slug, lp.type);
      const appDir = path.join(distDir, "apps", appId);
      const rendered = await renderLp({ schoolConfig, lp, appId, pageTemplate, tokensCss, baseCss });

      await fs.mkdir(pageDir, { recursive: true });
      await fs.writeFile(path.join(pageDir, "index.html"), rendered.html);
      await fs.mkdir(appDir, { recursive: true });
      await fs.writeFile(path.join(appDir, "index.html"), rendered.html);

      if (!rendered.hubspotConfigured) {
        warnings.push(`${appId}: HubSpot pendente`);
      }

      manifest.push({
        appId,
        type: lp.type,
        brand: schoolConfig.brand.name,
        brandSlug: schoolConfig.brand.slug,
        brandDomain: schoolConfig.brand.domain || "",
        school: schoolConfig.school.name,
        schoolSlug: schoolConfig.school.slug,
        model: rendered.model,
        primaryDomain: domainFor(schoolConfig, lp),
        domainAliases: lp.domain?.aliases || [],
        hubspotConfigured: rendered.hubspotConfigured,
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
      ["appId", "model", "primaryDomain", "domainAliases", "hubspotConfigured", "dist"].map(csvValue).join(","),
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

  return { appCount: manifest.length, schoolCount: files.length, warnings };
}

async function buildPreviews({ pageTemplate, tokensCss, baseCss }) {
  const config = JSON.parse(await fs.readFile(previewsPath, "utf8"));
  const previewManifest = [];
  let rootPreviewHtml = "";

  await fs.mkdir(previewsDir, { recursive: true });

  for (const lp of config.lps) {
    const appId = `preview--${lp.model}`;
    const rendered = await renderLp({
      schoolConfig: config.school,
      lp,
      appId,
      pageTemplate,
      tokensCss,
      baseCss
    });
    const previewDir = path.join(previewsDir, lp.model);

    await fs.mkdir(previewDir, { recursive: true });
    await fs.writeFile(path.join(previewDir, "index.html"), rendered.html);

    if (lp.model === "matriculas-uniao-institucional") {
      rootPreviewHtml = rendered.html;
    }

    previewManifest.push({
      category: lp.category,
      model: lp.model,
      title: lp.title,
      href: `./${lp.model}/`
    });
  }

  const cards = previewManifest
    .map(
      (item) => `<a class="preview-card" href="${item.href}"><span>${escapeHtml(item.category)}</span><strong>${escapeHtml(item.model)}</strong><small>${escapeHtml(item.title)}</small></a>`
    )
    .join("\n        ");

  await fs.writeFile(
    path.join(previewsDir, "index.html"),
    `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Previews de modelos | LPs RAIZ</title>
    <style>
      body { margin: 0; background: #f7f8f6; color: #111916; font-family: Arial, Helvetica, sans-serif; }
      main { width: min(1120px, calc(100% - 40px)); margin: 0 auto; padding: 56px 0; }
      h1 { max-width: 760px; margin: 0 0 14px; font-size: clamp(2.5rem, 6vw, 4.75rem); line-height: 1; letter-spacing: 0; }
      p { max-width: 640px; margin: 0 0 32px; color: #66736e; font-size: 1.125rem; line-height: 1.5; }
      .grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; }
      .preview-card { min-height: 150px; display: grid; align-content: space-between; padding: 22px; border: 1px solid rgb(17 25 22 / 0.14); border-radius: 8px; background: #fff; color: inherit; text-decoration: none; }
      .preview-card:hover { border-color: #0f6b5f; }
      span { color: #66736e; font-size: 0.875rem; font-weight: 700; }
      strong { display: block; font-size: 1.5rem; }
      small { color: #66736e; font-size: 0.95rem; line-height: 1.4; }
      @media (max-width: 720px) { .grid { grid-template-columns: 1fr; } }
    </style>
  </head>
  <body>
    <main>
      <h1>Previews dos modelos de LP</h1>
      <p>Abra cada modelo para comparar estrutura, ritmo visual, area de formulario HubSpot e tom de campanha.</p>
      <div class="grid">
        ${cards}
      </div>
    </main>
  </body>
</html>
`
  );

  await fs.writeFile(path.join(previewsDir, "manifest.json"), `${JSON.stringify(previewManifest, null, 2)}\n`);
  if (rootPreviewHtml) {
    await fs.writeFile(path.join(distDir, "index.html"), rootPreviewHtml);
  }
  return previewManifest.length;
}

async function build() {
  const pageTemplate = await fs.readFile(pageTemplatePath, "utf8");
  const tokensCss = await fs.readFile(tokensCssPath, "utf8");
  const baseCss = await fs.readFile(baseCssPath, "utf8");

  await fs.rm(distDir, { recursive: true, force: true });

  const apps = await buildApps({ pageTemplate, tokensCss, baseCss });
  const previewCount = await buildPreviews({ pageTemplate, tokensCss, baseCss });

  console.log(`Build finalizado: ${apps.appCount} LP(s) em ${apps.schoolCount} escola(s).`);
  console.log(`Previews gerados: ${previewCount} modelo(s).`);
  for (const warning of apps.warnings) {
    console.warn(`Aviso: ${warning}`);
  }
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
