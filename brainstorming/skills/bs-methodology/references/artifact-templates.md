# Template Artefatti BrainStorming

## Template JTBD (Job-to-be-Done)

```
Quando [situazione/contesto],
voglio [motivazione/azione],
così da [risultato atteso/beneficio].
```

## Template Ipotesi Testabile

```
### H[N] — [Critica/Importante/Nice-to-have]
**Ipotesi**: Se [condizione], allora [risultato atteso].
**Metrica**: [come misurare]
**Soglia**: [valore target]
**Esperimento**: [come testare]
**Timeframe**: [quando valutare]
```

## Template Competitor Table

```
| Nome | Tipo | Target | Punti di forza | Debolezze | Pricing | Fonte |
|------|------|--------|---------------|-----------|---------|-------|
```

## Template MoSCoW

```
### Must Have
| Feature | Giustificazione (H/rischio) | Effort |
|---------|-----------------------------|--------|

### Should Have
| Feature | Motivo | Effort |
|---------|--------|--------|

### Could Have
| Feature | Motivo | Effort |
|---------|--------|--------|

### Won't Have (Anti-Scope)
| Feature | Motivo esclusione |
|---------|------------------|
```

## Template ADR (Architecture Decision Record)

```
## ADR-[N]: [Titolo Decisione]
- **Data**: [YYYY-MM-DD]
- **Status**: [proposta/accettata/deprecata]
- **Contesto**: [vincoli, requisiti, situazione]
- **Decisione**: [cosa si è deciso]
- **Alternative considerate**: [A, B, C]
- **Tradeoff**: [pro/contro]
- **Conseguenze**: [cosa abilita, cosa limita]
```

## Template User Journey

```
## Journey: [Nome Flusso]
**Persona**: [chi]
**Obiettivo**: [cosa vuole ottenere]

| Step | Azione | Schermata | Stato | Note |
|------|--------|-----------|-------|------|
| 1 | — | — | default | — |
| 2 | — | — | loading | — |
| 3 | — | — | success/error | — |
```

## Template Wireframe Testuale

```
## [Nome Schermata]

┌─────────────────────────────┐
│  [Header / Nav]             │
├─────────────────────────────┤
│                             │
│  [Componente principale]    │
│                             │
│  [Form / Lista / Card]      │
│                             │
├─────────────────────────────┤
│  [Footer / CTA]             │
└─────────────────────────────┘

**Stati**: default | empty | loading | error | success
**Componenti**: [elenco]
**Interazioni**: [elenco]
```

## Template API Contract

```
### [METHOD] /api/v1/[resource]
- **Auth**: [JWT/API Key/None]
- **Request**:
  ```json
  {
    "field": "type — descrizione"
  }
  ```
- **Response 200**:
  ```json
  {
    "field": "type — descrizione"
  }
  ```
- **Errori**: 400, 401, 404, 500
```

## Formato Changelog Entry

```
### [Titolo Decisione]
- **Data**: [ISO timestamp]
- **Fase**: [numero]
- **Agente**: [nome agente]
- **Decisione**: [cosa]
- **Contesto**: [perché]
```

## Mappatura BS → UMCC (specs/)

### 02-problem-framing.md → specs/01-vision.md
- JTBD → Vision Statement
- Ipotesi H → Assumptions
- Metriche → Success Metrics
- Target utente → Target Users/Personas

### 03-market-research.md + 04-mvp-scope.md → specs/02-prd.md
- Competitor → Market Analysis
- MoSCoW → Functional Requirements + Prioritization
- Anti-scope → Out of Scope
- Rischi → Risks

### 05-ux-flows.md → specs/ux/wireframes.md
- Journey → User Flows
- Wireframe testuali → Wireframes

### 06-architecture.md → specs/04-tech-spec.md
- Stack → Technology Stack
- Schema dati → Data Model
- API contract → API Design
- ADR → Architecture Decisions
