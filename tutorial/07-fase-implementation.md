# Fase 7 — Implementation

## Obiettivo

Implementare il codice **story per story**, seguendo il piano dello sprint. Ogni storia viene implementata completamente (backend, frontend, test) prima di passare alla successiva. Ogni Acceptance Criterion deve avere un test che passa.

## Agenti responsabili

L'implementazione coinvolge piu agenti, coordinati da **app-expert**:

- **be-architect** — guida l'implementazione backend, API, logica di business
- **db-expert** — implementa migrazioni, ottimizza query, risolve problemi di performance DB
- **ux-designer** — verifica che il frontend rispetti i wireframe e il design system
- **test-engineer** — verifica che ogni AC abbia un test corrispondente

## Comando

```
/dev-implement
```

Puoi specificare una storia da implementare:

```
/dev-implement US-001
```

Oppure lanciare senza argomento per vedere la lista delle storie disponibili nello sprint corrente.

> **Prerequisito**: le Fasi 1-5 (e idealmente la 6) devono essere completate.

## Cosa aspettarsi

Per ogni storia, il flusso e:

1. **Lettura contesto** — l'agente legge la storia, gli AC, la tech spec e lo sprint plan
2. **Implementazione sequenziale dei task**:
   - Setup/configurazione (se necessario)
   - Database — migrazioni, modelli
   - Backend — route, controller, service, validazione
   - Frontend — componenti, pagine, integrazione API
   - Test — unit test, integration test
3. **Verifica AC** — per ogni Acceptance Criterion:
   - Il test corrispondente viene scritto
   - Il test viene eseguito
   - Il risultato (PASS/FAIL) viene registrato
4. **Log risultati** — aggiornamento di `specs/07-implementation.md`
5. **Prossima storia** — se tutti gli AC passano, si prosegue

### La regola d'oro

> **Ogni AC deve avere almeno un test che passa.** Non si passa alla storia successiva finche tutti gli AC della storia corrente non sono verificati.

## Come rispondere

> **Suggerimento**: In questa fase sei meno coinvolto nella conversazione — l'agente implementa e tu verifichi. Ma puoi intervenire in qualsiasi momento.

- **Guida iniziale**: se hai setup specifico (es. "usa pnpm", "il database e gia attivo su localhost:5432"), comunicalo subito
- **Decisioni ambigue**: l'agente potrebbe chiederti chiarimenti su dettagli non coperti dalle spec
- **Code review in tempo reale**: se vedi qualcosa che non ti convince, fermalo e discuti
- **Problemi bloccanti**: se un test non passa, l'agente prova a risolvere; se non ci riesce, ti coinvolge

## Output atteso

L'implementazione aggiorna incrementalmente:

```
specs/07-implementation.md
```

Questo file traccia:

- **Storie completate** — con data, risultati AC, note
- **Storie in corso** — stato corrente, task completati
- **Problemi riscontrati** — bug, decisioni prese, workaround
- **Metriche** — % AC passati, test coverage stimata

### Struttura tipo del tracking

```markdown
## US-001 — Creazione lista della spesa

**Status**: Completata
**Data**: 2026-02-26
**Sprint**: Sprint 1

### Acceptance Criteria

| AC | Descrizione | Test | Risultato |
|----|------------|------|-----------|
| AC-001 | Happy path — creazione lista | test/lists.test.ts:12 | PASS |
| AC-002 | Error — nome vuoto | test/lists.test.ts:28 | PASS |
| AC-003 | Error — nome duplicato | test/lists.test.ts:41 | PASS |
| AC-004 | Edge — limite 50 liste | test/lists.test.ts:55 | PASS |

### Note
- Aggiunto indice parziale su (owner_id, name) WHERE deleted_at IS NULL
  per garantire unicita dei nomi per utente
```

## Esempio SpesaFacile

Durante l'implementazione di US-001, l'agente:

1. **Crea la migrazione Prisma**:
   ```prisma
   model ShoppingList {
     id        String   @id @default(uuid())
     name      String   @db.VarChar(100)
     ownerId   String   @map("owner_id")
     owner     User     @relation(fields: [ownerId], references: [id])
     isArchived Boolean @default(false) @map("is_archived")
     deletedAt DateTime? @map("deleted_at")
     createdAt DateTime @default(now()) @map("created_at")
     updatedAt DateTime @updatedAt @map("updated_at")

     @@map("shopping_lists")
     @@unique([ownerId, name], map: "idx_lists_owner_name")
   }
   ```

2. **Implementa l'endpoint** `POST /api/v1/lists` con validazione
3. **Crea il componente React** `CreateListModal`
4. **Scrive i test** per tutti e 4 gli AC
5. **Esegue i test** e verifica PASS
6. **Aggiorna** `specs/07-implementation.md`

## Checkpoint

Prima di procedere alla Fase 8, verifica che:

- [ ] Tutte le storie dello sprint sono state implementate
- [ ] `specs/07-implementation.md` esiste e traccia ogni storia
- [ ] Ogni AC ha almeno un test corrispondente
- [ ] Tutti i test passano (no FAIL residui)
- [ ] Il codice e funzionante (l'app si avvia e le feature funzionano)
- [ ] `_status.md` mostra la Fase 7 come in corso o completata per lo sprint

> **Nota**: La Fase 7 si ripete per ogni sprint. Al termine di uno sprint, si passa alla Fase 8 (Validation) per quello sprint, poi si torna alla Fase 7 per lo sprint successivo.

---

> **Prossimo passo**: [Fase 8 — Validation](./08-fase-validation.md)
