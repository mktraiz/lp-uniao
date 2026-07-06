# Organizacao das LPs

## Cadastro

O cadastro oficial das LPs fica em `content/schools/`.

Cada arquivo representa uma escola e contem:

- dados da marca;
- dados da escola;
- cores;
- as duas LPs;
- textos principais;
- CTA;
- destaques.

## Producao

A pasta `landing-pages/` e a area de trabalho criativa. Use para guardar:

- brief;
- copy;
- referencias;
- imagens;
- observacoes de campanha.

## Build

O build le os arquivos JSON de `content/schools/` e gera HTML estatico em `dist/`.

Esse formato reduz risco na VPS, porque o EasyPanel so precisa construir a imagem Docker e servir arquivos com Nginx.
