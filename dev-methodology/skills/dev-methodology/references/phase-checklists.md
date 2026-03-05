# Phase Checklists — Quality Gates

Checklist verificabili per ogni fase. Usate da `/dev-review` per il completeness check.

## Fase 1: Vision

- [ ] Vision Statement presente (1 frase, non vuota)
- [ ] Almeno 3 Obiettivi Strategici
- [ ] Almeno 2 Target Users con pain point
- [ ] Almeno 3 Success Metrics con numeri
- [ ] Constraints elencati (almeno 1)
- [ ] Assumptions documentate

## Fase 2: PRD

- [ ] Almeno 2 Personas con nome, ruolo, pain points, obiettivi
- [ ] Requisiti Funzionali organizzati per Epic
- [ ] Ogni Feature ha ID (F-XXX) e priorita MoSCoW
- [ ] Requisiti Non-Funzionali misurabili (con numeri, non aggettivi)
- [ ] MoSCoW completo (Must, Should, Could, Won't Have tutti presenti)
- [ ] Almeno 3 Rischi con probabilita, impatto, mitigazione
- [ ] Out of Scope definito

## Fase 3: User Stories

- [ ] Ogni Feature (F-XXX) del PRD ha almeno 1 User Story
- [ ] Ogni Story ha ID (US-XXX) e formato "Come [utente], voglio [azione], in modo da [beneficio]"
- [ ] Ogni Story ha almeno 4 AC in formato DATO-QUANDO-ALLORA
- [ ] Almeno 1 happy path AC per story
- [ ] Almeno 2 error path AC per story
- [ ] Almeno 1 edge case AC per story
- [ ] Ogni Story ha Story Points (scala Fibonacci 1-13)
- [ ] Ogni Story ha tag MoSCoW
- [ ] Tabella riepilogativa con totali SP

## Fase 4: Tech Spec

- [ ] Stack tecnologico definito con motivazione per ogni scelta
- [ ] Diagramma architettura (ASCII)
- [ ] Schema Database con CREATE TABLE completo (campi, tipi, constraint, indici)
- [ ] API Endpoints definiti (path, metodo, request, response, errori)
- [ ] Struttura file progetto
- [ ] Regole di business elencate
- [ ] Sezione sicurezza (auth, autorizzazione, protezioni)
- [ ] Performance target definiti con numeri
- [ ] Test strategy con framework e coverage target
- [ ] Mappatura Story → Endpoint
- [ ] Almeno 1 ADR documentato

## Fase 5: Sprint Plan

- [ ] Velocity definita (SP/sprint)
- [ ] Tutte le stories Must Have nei primi sprint
- [ ] Ogni sprint ha objective chiaro
- [ ] Task breakdown per ogni story (3-8 task)
- [ ] Owner ruolo per ogni task
- [ ] SP totali per sprint coerenti con velocity
- [ ] SP totali progetto = somma SP tutte le stories
- [ ] Rischi del piano documentati
- [ ] Completion criteria per ogni sprint
