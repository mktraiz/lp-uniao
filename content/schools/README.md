# Cadastro das escolas

Cada arquivo JSON em `content/schools/` representa uma escola e suas duas LPs.

Campos importantes:

- `brand.name`: nome da marca.
- `brand.slug`: slug usado na URL.
- `brand.domain`: dominio principal da marca.
- `school.name`: nome da escola/unidade.
- `school.slug`: slug usado na URL.
- `lps`: lista com exatamente duas paginas, normalmente `captacao` e `campanha`.
- `lps[].model`: modelo visual usado pelo gerador.
- `lps[].domain.primary`: dominio ou subdominio principal daquela LP no EasyPanel.
- `lps[].domain.aliases`: dominios extras que devem apontar para a mesma LP.
- `lps[].hubspot.portalId`: portal HubSpot.
- `lps[].hubspot.formId`: formulario HubSpot.
- `whatsapp`: numero ou link final alternativo para CTA, quando existir.

Use `escola-exemplo.json` como modelo.
