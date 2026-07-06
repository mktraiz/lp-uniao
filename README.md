# LPs RAIZ Educacao

Base para criar, organizar e publicar landing pages das marcas/escolas da RAIZ Educacao.

Cada escola deve ter duas LPs:

- `captacao`: pagina principal de captacao/matriculas.
- `campanha`: pagina de campanha, evento, unidade, bolsa, simulado ou acao especifica.

## Estrutura

```text
content/
  schools/              Cadastro e conteudo estruturado de cada escola
landing-pages/
  marcas/               Briefs, copies, assets e referencias por marca/escola
templates/              HTML base usado pelo gerador estatico
scripts/                Automacoes para criar escolas e gerar o build
deploy/
  easypanel/            Arquivos e notas de publicacao na VPS
dist/                   Saida gerada para publicacao
```

## Fluxo recomendado

1. Cadastre a escola em `content/schools/<slug-da-escola>.json`.
2. Crie a pasta da escola a partir de `landing-pages/marcas/_template`.
3. Preencha os briefs das duas LPs.
4. Rode `npm run build`.
5. Publique o projeto no EasyPanel usando o `Dockerfile` da raiz.

## Comandos

```powershell
npm install
npm run build
npm run serve
```

O build gera os arquivos finais em `dist/`.

## Padrao de URL

Cada LP sera publicada neste formato:

```text
/<marca>/<escola>/captacao/
/<marca>/<escola>/campanha/
```

Exemplo:

```text
/marca-exemplo/colegio-exemplo/captacao/
/marca-exemplo/colegio-exemplo/campanha/
```
