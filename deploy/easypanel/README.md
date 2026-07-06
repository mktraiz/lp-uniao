# Deploy no EasyPanel

Este projeto esta preparado para deploy como varios apps Docker.

Cada LP deve ser cadastrada como um aplicativo separado no EasyPanel.

## Configuracao sugerida

- Tipo: App Docker / Git Repository.
- Porta interna: `80`.
- Dockerfile: `Dockerfile` na raiz do projeto.
- Build command: nao precisa configurar; o Dockerfile roda `npm run build`.
- Build arg obrigatorio por LP: `LP_APP_ID=<appId-da-lp>`.
- Dominios: usar o `primaryDomain` gerado no manifesto.
- Health check path: `/`.

## Publicacao

1. Suba este projeto para um repositorio Git.
2. No EasyPanel, crie um novo app para cada LP a partir do mesmo repositorio.
3. Em cada app, configure o build arg `LP_APP_ID` da LP correspondente.
4. Configure o dominio ou subdominio especifico daquela LP.
5. Ative HTTPS pelo painel.
6. Faca o deploy.

## Exemplo de apps

```text
App EasyPanel: lp-colegio-exemplo-captacao
Build arg: LP_APP_ID=marca-exemplo--colegio-exemplo--captacao

App EasyPanel: lp-colegio-exemplo-campanha
Build arg: LP_APP_ID=marca-exemplo--colegio-exemplo--campanha
```

## Rotas

O manifesto gerado em `dist/apps-manifest.json` lista todos os apps de LP disponiveis.

O build tambem gera `dist/easypanel-apps.csv` para facilitar a criacao dos apps no painel.

Cada item do manifesto inclui:

- `appId`: valor para o build arg `LP_APP_ID`.
- `primaryDomain`: dominio principal para cadastrar no app.
- `domainAliases`: dominios extras para apontar para o mesmo app.

Quando o build completo for servido localmente pelo app `all`, as paginas tambem seguem:

```text
/<marca>/<escola>/captacao/
/<marca>/<escola>/campanha/
```

Em producao, cada app deve servir sua LP diretamente em `/`.

## Dominios por marca

Use um dominio/subdominio por LP, mantendo o dominio da marca.

Exemplos:

```text
bolsao.matrizeducacao.com.br
matriculas.apogeu.com.br
```

No DNS, cada subdominio deve apontar para a VPS ou para o endpoint indicado pelo EasyPanel.
