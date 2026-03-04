---
name: mucc-update
description: "Aggiorna i plugin MUCC (dev-methodology e/o brainstorming). Usa questa skill quando l'utente vuole aggiornare il plugin, le skill, i tool, o dice aggiorna plugin, update plugin, aggiorna skill, update, pull, mucc-update."
---

# mucc-update — Aggiornamento Plugin MUCC

Aggiorna i plugin alla versione piu recente. Legge `mucc-plugins.json` per sapere quali plugin gestire — aggiungere un nuovo plugin significa solo aggiungere una riga al config.

## Workflow

### Step 1: RILEVA PERCORSO REPO

Trova la directory root del repo seguendo i symlink delle skill installate:

```bash
# Cerca qualsiasi skill installata che punti al repo
for skill_link in "$HOME/.claude/skills"/dev-* "$HOME/.claude/skills"/bs-* "$HOME/.claude/skills"/mucc-*; do
  if [ -L "$skill_link" ]; then
    SKILL_TARGET=$(readlink "$skill_link")
    # Risali: skills/<name> → skills → <plugin-dir> → repo root
    REPO_DIR=$(dirname "$(dirname "$(dirname "$SKILL_TARGET")")")
    break
  fi
done
echo "Repo trovato: $REPO_DIR"
```

Se nessun symlink trovato, chiedi all'utente il percorso del repo.

### Step 2: SALVA VERSIONE CORRENTE

```bash
cd "$REPO_DIR"
OLD_COMMIT=$(git rev-parse --short HEAD)
echo "Versione corrente: $OLD_COMMIT"
```

### Step 3: GIT PULL

```bash
cd "$REPO_DIR"
git pull --ff-only
```

Se fallisce (conflitti o divergenza):
- Mostra l'errore all'utente
- Suggerisci: `cd REPO_DIR && git status` per diagnosticare
- NON eseguire `git reset` o `git merge` automaticamente

### Step 4: LEGGI CONFIG PLUGIN

Dopo il pull, leggi `mucc-plugins.json` dalla root del repo:

```bash
cat "$REPO_DIR/mucc-plugins.json"
```

Il file contiene:
- `plugins[]`: array di plugin, ognuno con `name`, `skills_dir` (percorso relativo alla root), `prefix` (pattern glob)
- `shared_skills[]`: skill condivise installate sempre (come `mucc-update`)

### Step 5: AGGIORNA SYMLINK PER OGNI PLUGIN

Per ogni plugin nel config, scansiona la sua `skills_dir` e sistema i symlink:

```bash
SKILLS_DIR="$HOME/.claude/skills"

# Per ogni plugin in mucc-plugins.json
for plugin in $(cat "$REPO_DIR/mucc-plugins.json" | ...parse plugins...); do
  PLUGIN_SKILLS_SOURCE="$REPO_DIR/$plugin_skills_dir"

  # Salta se la directory non esiste (plugin non ancora nel repo)
  [ -d "$PLUGIN_SKILLS_SOURCE" ] || continue

  # Scansiona tutte le skill directory
  for skill_dir in "$PLUGIN_SKILLS_SOURCE"/*/; do
    [ -d "$skill_dir" ] || continue
    skill_name=$(basename "$skill_dir")

    if [ -L "$SKILLS_DIR/$skill_name" ]; then
      # Symlink esistente — verifica target
      current_target=$(readlink "$SKILLS_DIR/$skill_name")
      expected_target="$PLUGIN_SKILLS_SOURCE/$skill_name"
      if [ "$current_target" != "$expected_target" ]; then
        rm -f "$SKILLS_DIR/$skill_name"
        ln -s "$expected_target" "$SKILLS_DIR/$skill_name"
        echo "AGGIORNATO: $skill_name"
      fi
    elif [ ! -e "$SKILLS_DIR/$skill_name" ]; then
      # Nuova skill — crea symlink
      ln -s "$PLUGIN_SKILLS_SOURCE/$skill_name" "$SKILLS_DIR/$skill_name"
      echo "NUOVA: $skill_name"
    fi
  done
done
```

### Step 6: MOSTRA CHANGELOG

```bash
cd "$REPO_DIR"
NEW_COMMIT=$(git rev-parse --short HEAD)

if [ "$OLD_COMMIT" != "$NEW_COMMIT" ]; then
  echo "Aggiornato: $OLD_COMMIT → $NEW_COMMIT"
  git log --oneline "$OLD_COMMIT".."$NEW_COMMIT"
else
  echo "Gia aggiornato — nessuna modifica disponibile."
fi
```

Leggi anche `CHANGELOG.md` per mostrare le novita in formato leggibile.

### Step 7: VERIFICA TOOL (opzionale)

Mostra lo stato dei tool esterni senza installarli automaticamente:

```bash
echo "=== Quality tools ==="
command -v knip &>/dev/null    && echo "OK knip"    || echo "MISS knip"
command -v eslint &>/dev/null  && echo "OK eslint"  || echo "MISS eslint"
command -v tsc &>/dev/null     && echo "OK tsc"     || echo "MISS tsc"
command -v ruff &>/dev/null    && echo "OK ruff"    || echo "MISS ruff"
command -v mypy &>/dev/null    && echo "OK mypy"    || echo "MISS mypy"
command -v vulture &>/dev/null && echo "OK vulture" || echo "MISS vulture"

echo "=== Security SAST ==="
command -v semgrep &>/dev/null && echo "OK semgrep" || echo "MISS semgrep"
command -v bearer &>/dev/null  && echo "OK bearer"  || echo "MISS bearer"
command -v bandit &>/dev/null  && echo "OK bandit"  || echo "MISS bandit"

echo "=== Security SCA ==="
npm audit --version &>/dev/null 2>&1 && echo "OK npm audit"
command -v osv-scanner &>/dev/null && echo "OK osv-scanner" || echo "MISS osv-scanner"
command -v retire &>/dev/null      && echo "OK retire"      || echo "MISS retire"
command -v pip-audit &>/dev/null   && echo "OK pip-audit"   || echo "MISS pip-audit"
```

Se ci sono tool mancanti, chiedi all'utente se vuole installarli:
```bash
cd "$REPO_DIR"
bash install.sh --tools-only
```

### Step 8: REPORT FINALE

```
## Aggiornamento completato

| Aspetto | Stato |
|---------|-------|
| Repository | OLD_COMMIT → NEW_COMMIT (N commit) |
| Plugin rilevati | dev-methodology, brainstorming |
| Skill installate | X totali (Y nuove) |
| Tool quality | X/6 disponibili |
| Tool security | X/7 disponibili |

### Novita in questa versione
[Estratto da CHANGELOG.md]

> Riavvia Claude Code per caricare le skill aggiornate.
```

## Note

- La skill legge `mucc-plugins.json` per sapere quali plugin gestire — **mai hardcodato**
- Se un plugin nel config non ha la directory (es. `brainstorming/` non ancora copiato), viene saltato silenziosamente
- Aggiungere un nuovo plugin = aggiungere un blocco a `mucc-plugins.json`, la skill lo gestisce automaticamente
- NON installa tool automaticamente — mostra quelli mancanti e chiede conferma
- Se `git pull` fallisce, NON tentare operazioni distruttive
- Dopo l'aggiornamento, ricorda all'utente di riavviare Claude Code
