# Deploy no EasyPanel

Este projeto esta preparado para deploy como app Docker.

## Configuracao sugerida

- Tipo: App Docker / Git Repository.
- Porta interna: `80`.
- Dockerfile: `Dockerfile` na raiz do projeto.
- Build command: nao precisa configurar; o Dockerfile roda `npm run build`.
- Health check path: `/`.

## Publicacao

1. Suba este projeto para um repositorio Git.
2. No EasyPanel, crie um novo app a partir do repositorio.
3. Configure o dominio principal ou subdominio das LPs.
4. Ative HTTPS pelo painel.
5. Faca o deploy.

## Rotas

As paginas geradas seguem:

```text
/<marca>/<escola>/captacao/
/<marca>/<escola>/campanha/
```

Para dominios separados por marca, use os redirects ou aliases do EasyPanel/Nginx conforme a estrategia final.
