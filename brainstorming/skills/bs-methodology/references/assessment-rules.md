# Regole Assessment Operativo

## Step 1 — Tipo di Lavoro

| Tipo | Descrizione |
|------|-------------|
| T1 | Idea → validazione (non hai repo) |
| T2 | Greenfield MVP (repo nuovo) |
| T3 | Estensione di un prodotto (hai repo + utenti/metriche) |
| T4 | Repo ereditato (codice altrui/legacy) |
| T5 | Bug/performance/scale (problema tecnico specifico) |

## Step 2 — Scorecard (0-2 per riga)

0 = no / 1 = un po' / 2 = molto

| # | Domanda | Suggerisce |
|---|---------|------------|
| 1 | Il problema utente è chiarissimo? (se NO, aumenta) | Problem Framer |
| 2 | Sai già "perché te" vs competitor? (se NO) | Researcher |
| 3 | Vincoli tempo forti (≤ 2 settimane)? | MVP Scoper + Orchestratore |
| 4 | UX/onboarding è critica? | UX Flow + Copy |
| 5 | Lavori su codice non tuo? | Cartographer + Docs Writer |
| 6 | Repo poco testato/instabile? | QA + Bug Triage |
| 7 | Dati sensibili/pagamenti/ruoli? | Security & Privacy |
| 8 | Tante integrazioni esterne? | Architect + Risk Auditor |
| 9 | Problema principale = performance/costi? | Performance & Cost |
| 10 | Devi dimostrare traction con numeri? | Analytics & Experiment |

## Step 3 — Regole di Attivazione

- **Sempre:** Orchestratore
- **Se (D1 + D2) >= 3:** Problem Framer + Market Researcher
- **Se D3 >= 1:** MVP Scoper
- **Se D4 >= 1:** UX Flow & Wireframe (+ Copy se disponibile)
- **Se D5 >= 1:** Codebase Cartographer (+ Documentation Writer)
- **Se D6 >= 1:** QA/Test + Bug Triage
- **Se D7 >= 1:** Security & Privacy
- **Se D9 >= 1:** Performance & Cost
- **Se D10 >= 1:** Analytics & Experiment

## Workflow Consigliato per Tipo

| Tipo | Workflow | Skill principali |
|------|----------|-----------------|
| T1 | A (Idea→MVP) | brainstorm, problem, research, scope, ux, architect |
| T2 | A (Greenfield) | problem, research, scope, ux, architect |
| T3 | B (Estensione) | onboarding, problem, scope |
| T4 | B (Repo ereditato) | onboarding, problem, scope |
| T5 | C/D (Bug/Perf) | onboarding (parziale), performance, architect |
