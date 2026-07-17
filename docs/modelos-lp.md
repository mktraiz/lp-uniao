# Modelos de LP

## Direcao recomendada

Usei `design-taste-frontend` como criterio de qualidade visual e `design-system` como base de tokens.

Decisao: manter um design system proprio em CSS estatico, sem instalar shadcn, Tailwind ou React por enquanto. Para este projeto, isso e melhor porque teremos muitas LPs publicadas como apps separados no EasyPanel. Menos dependencias significa deploy mais simples, build mais rapido e menos risco operacional.

## Bolsao

| Modelo | Quando usar |
| --- | --- |
| `bolsao-resultado` | Bolsa, desconto, prova, campanha com oferta forte e conversao direta. |
| `bolsao-jornada` | Quando a campanha precisa explicar etapas: inscricao, prova, resultado e atendimento. |

## Matriculas

| Modelo | Quando usar |
| --- | --- |
| `matriculas-uniao-institucional` | Modelo fotografico/institucional inspirado no site do Colegio Uniao, para marcas com historia, estrutura e autoridade local. |
| `matriculas-premium` | Institucional forte, decisao familiar considerada, marca com alto valor percebido. |
| `matriculas-proximidade` | Unidade, acolhimento, rotina escolar, visita e atendimento consultivo. |
| `matriculas-performance` | Diferenciais, resultados, comparacao e argumentos objetivos. |
| `matriculas-afeto` | Tom emocional, familia, primeira infancia ou campanhas mais acolhedoras. |

## Eventos de captacao

| Modelo | Quando usar |
| --- | --- |
| `evento-open-day` | Escola aberta, visita guiada, tour pela unidade. |
| `evento-experiencia` | Aula experimental, vivencia, experiencia pratica. |
| `evento-palestra` | Palestra, encontro pedagogico, evento de autoridade. |
| `evento-imersao` | Evento especial, premium, com agenda mais elaborada. |

## Como escolher no JSON

```json
{
  "type": "captacao",
  "model": "matriculas-premium"
}
```

## Formulario e rastreio

O build injeta automaticamente o widget Raiz no ponto de formulario de cada modelo:

```html
<div id="raiz-form"></div>
<script src="https://formularios.raizeducacao.com.br/widget.js?v=2" data-api="https://formularios.raizeducacao.com.br" defer></script>
```

O rastreio HubSpot global e inserido no `<head>` de todas as LPs com o portal `7691970`.