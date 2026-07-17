# Organizacao das LPs

## Cadastro

O cadastro oficial das LPs fica em `content/schools/`.

Cada arquivo representa uma escola e contem:

- dados da marca;
- dados da escola;
- cores;
- as duas LPs;
- modelo visual de cada LP;
- textos principais;
- CTA;
- destaques.
- dominio principal da LP;
- aliases de dominio, quando houver.
- formulario Raiz injetado automaticamente pelo gerador.

## Producao

A pasta `landing-pages/` e a area de trabalho criativa. Use para guardar:

- brief;
- copy;
- referencias;
- imagens;
- observacoes de campanha.

## Build e apps

O build le os arquivos JSON de `content/schools/` e gera HTML estatico em `dist/`.

Cada LP tambem e copiada para uma pasta propria em `dist/apps/<appId>/`.

Esse formato reduz risco na VPS, porque o EasyPanel so precisa construir a imagem Docker e servir uma pasta estatica com Nginx.

## Deploy por LP

Cada LP sera um aplicativo separado no EasyPanel.

Use o mesmo repositorio e o mesmo `Dockerfile`, mudando apenas o build arg:

```text
LP_APP_ID=<marca>--<escola>--<tipo-da-lp>
```

Exemplo:

```text
LP_APP_ID=marca-exemplo--colegio-exemplo--captacao
```

O dominio de cada app vem do campo `lps[].domain.primary`.

Exemplos:

```text
bolsao.matrizeducacao.com.br
matriculas.apogeu.com.br
```

## Modelos

Os modelos ficam em `templates/models/`.

Catalogo:

- `bolsao-resultado`
- `bolsao-jornada`
- `matriculas-premium`
- `matriculas-proximidade`
- `matriculas-performance`
- `matriculas-afeto`
- `evento-open-day`
- `evento-experiencia`
- `evento-palestra`
- `evento-imersao`

O campo `lps[].model` escolhe qual deles sera usado no build.
