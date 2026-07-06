# Template de app no EasyPanel

Use este modelo para cada LP.

```text
Nome do app:
lp-<escola>-<tipo>

Repositorio:
<url-do-repositorio-das-lps>

Dockerfile:
Dockerfile

Porta interna:
80

Build arg:
LP_APP_ID=<marca>--<escola>--<tipo>

Health check:
/

Dominio:
<primaryDomain-da-lp>

Aliases:
<domainAliases-da-lp-se-houver>
```

Exemplo:

```text
Nome do app:
lp-colegio-exemplo-captacao

Build arg:
LP_APP_ID=marca-exemplo--colegio-exemplo--captacao

Dominio:
matriculas.marcaexemplo.com.br
```
