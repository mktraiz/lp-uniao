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
  "model": "matriculas-premium",
  "hubspot": {
    "region": "na1",
    "portalId": "",
    "formId": ""
  }
}
```

## HubSpot

Cada LP deve ter seu proprio bloco:

```json
"hubspot": {
  "region": "na1",
  "portalId": "0000000",
  "formId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

Quando `portalId` e `formId` estiverem preenchidos, o build injeta automaticamente o script oficial do HubSpot naquela LP.

Se estiverem vazios, a LP mostra um placeholder interno de formulario pendente e o manifesto marca `hubspotConfigured: false`.
