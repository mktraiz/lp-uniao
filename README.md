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
dist/
  apps/                 Saida gerada por aplicativo de LP
```

## Fluxo recomendado

1. Cadastre a escola em `content/schools/<slug-da-escola>.json`.
2. Crie a pasta da escola a partir de `landing-pages/marcas/_template`.
3. Preencha os briefs das duas LPs.
4. Defina o dominio principal de cada LP em `lps[].domain.primary`.
5. Rode `npm run build`.
6. Publique cada LP como um aplicativo separado no EasyPanel usando o `Dockerfile` da raiz.

## Comandos

```powershell
npm install
npm run build
npm run serve
```

O build gera os arquivos finais em `dist/apps/`.

Cada LP recebe um `appId` no formato:

```text
<marca>--<escola>--<tipo-da-lp>
```

Exemplo:

```text
marca-exemplo--colegio-exemplo--captacao
marca-exemplo--colegio-exemplo--campanha
```

O manifesto `dist/apps-manifest.json` lista o `appId`, o dominio principal e os aliases de cada LP.

## Publicacao no EasyPanel

Cada LP deve virar um app separado na VPS.

No app do EasyPanel, use o mesmo repositorio e configure o build arg:

```text
LP_APP_ID=<appId-da-lp>
```

Exemplo para a LP de captacao:

```text
LP_APP_ID=marca-exemplo--colegio-exemplo--captacao
```

Depois, configure no EasyPanel o dominio principal que aparece em `primaryDomain`.

Exemplos de estrategia:

```text
bolsao.matrizeducacao.com.br
matriculas.apogeu.com.br
```

## Padrao interno de URL

Quando o build completo for servido localmente, as LPs tambem ficam disponiveis neste formato:

```text
/<marca>/<escola>/captacao/
/<marca>/<escola>/campanha/
```

Exemplo:

```text
/marca-exemplo/colegio-exemplo/captacao/
/marca-exemplo/colegio-exemplo/campanha/
```
