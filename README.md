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
  models/               Modelos visuais de LP
  shared/               Tokens e CSS compartilhado
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
5. Escolha o modelo visual em `lps[].model`.
6. O formulario Raiz e o rastreio HubSpot global ja sao injetados automaticamente no build.
7. Rode `npm run build`.
8. Publique cada LP como um aplicativo separado no EasyPanel usando o `Dockerfile` da raiz.
9. Em cada app publicado, a LP escolhida deve virar `dist/index.html`, para abrir direto em `/`.

## Comandos

```powershell
npm install
npm run build
npm run serve
```

Para ver todos os modelos:

```powershell
npm run build
npm run serve
```

Abra `/previews/`.

O build gera os arquivos finais em `dist/apps/` e tambem copia a LP escolhida para `dist/index.html`.

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
O arquivo `dist/easypanel-apps.csv` resume os apps para criacao no EasyPanel.

## Modelos disponiveis

- Bolsao: `bolsao-resultado`, `bolsao-jornada`.
- Matriculas: `matriculas-uniao-institucional`, `matriculas-premium`, `matriculas-proximidade`, `matriculas-performance`, `matriculas-afeto`.
- Eventos de captacao: `evento-open-day`, `evento-experiencia`, `evento-palestra`, `evento-imersao`.

Veja [docs/modelos-lp.md](docs/modelos-lp.md) para o criterio de uso.

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

Com isso, essa LP sera publicada como `index.html` na raiz do app. O dominio abre direto em `/`, sem `/previews/`, `/apps/` ou qualquer subpasta.

Para publicar um modelo de preview como app temporario, use:

```text
LP_MODEL=matriculas-uniao-institucional
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
