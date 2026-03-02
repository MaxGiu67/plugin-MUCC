---
name: dev-update
description: "Aggiorna il plugin dev-methodology. Usa questa skill quando l'utente vuole aggiornare il plugin, le skill, i tool, o dice aggiorna plugin, update plugin, aggiorna skill, aggiorna dev-methodology, update, pull."
---

# dev-update — Aggiornamento Plugin dev-methodology

Aggiorna il plugin alla versione piu recente: git pull, nuove skill, tool mancanti.

## Workflow

### Step 1: RILEVA PERCORSO PLUGIN

Trova la directory sorgente del plugin seguendo i symlink delle skill installate:

```bash
# Segui il symlink di una skill per trovare la root del repo
SKILL_LINK="$HOME/.claude/skills/dev-init"
if [ -L "$SKILL_LINK" ]; then
  SKILL_TARGET=$(readlink "$SKILL_LINK")
  # Risali: skills/dev-init → skills → dev-methodology → repo root
  PLUGIN_DIR=$(dirname "$(dirname "$(dirname "$SKILL_TARGET")")")
  echo "Plugin trovato: $PLUGIN_DIR"
else
  echo "ERRORE: skill dev-init non trovata come symlink"
fi
```

Se il symlink non esiste, chiedi all'utente il percorso del repo.

### Step 2: SALVA VERSIONE CORRENTE

Prima dell'aggiornamento, leggi la versione attuale per il confronto:

```bash
cd "$PLUGIN_DIR"
OLD_VERSION=$(git describe --tags 2>/dev/null || git rev-parse --short HEAD)
OLD_COMMIT=$(git rev-parse --short HEAD)
echo "Versione corrente: $OLD_COMMIT"
```

### Step 3: GIT PULL

Aggiorna il repo dalla remote:

```bash
cd "$PLUGIN_DIR"
git pull --ff-only
```

Se fallisce (conflitti o divergenza):
- Mostra l'errore all'utente
- Suggerisci: `cd PLUGIN_DIR && git status` per diagnosticare
- NON eseguire `git reset` o `git merge` automaticamente

### Step 4: MOSTRA CHANGELOG

Dopo il pull, mostra cosa e cambiato:

```bash
cd "$PLUGIN_DIR"
NEW_COMMIT=$(git rev-parse --short HEAD)

if [ "$OLD_COMMIT" != "$NEW_COMMIT" ]; then
  echo "Aggiornato: $OLD_COMMIT → $NEW_COMMIT"
  git log --oneline "$OLD_COMMIT".."$NEW_COMMIT"
else
  echo "Gia aggiornato — nessuna modifica disponibile."
fi
```

Leggi anche `CHANGELOG.md` per mostrare le novita in formato leggibile.

### Step 5: AGGIORNA SYMLINK SKILL

Verifica che tutte le skill del plugin siano linkate in `~/.claude/skills/`:

```bash
SKILLS_DIR="$HOME/.claude/skills"
SKILLS_SOURCE="$PLUGIN_DIR/dev-methodology/skills"

# Lista skill attese (leggi le directory in skills/)
for skill_dir in "$SKILLS_SOURCE"/dev-*/; do
  skill_name=$(basename "$skill_dir")

  if [ -L "$SKILLS_DIR/$skill_name" ]; then
    # Verifica che punti alla sorgente corretta
    current_target=$(readlink "$SKILLS_DIR/$skill_name")
    expected_target="$SKILLS_SOURCE/$skill_name"
    if [ "$current_target" != "$expected_target" ]; then
      rm -f "$SKILLS_DIR/$skill_name"
      ln -s "$expected_target" "$SKILLS_DIR/$skill_name"
      echo "AGGIORNATO: $skill_name (symlink corretto)"
    fi
  elif [ ! -e "$SKILLS_DIR/$skill_name" ]; then
    # Nuova skill — crea symlink
    ln -s "$SKILLS_SOURCE/$skill_name" "$SKILLS_DIR/$skill_name"
    echo "NUOVA: $skill_name aggiunta"
  fi
done
```

### Step 6: VERIFICA TOOL (opzionale)

Mostra lo stato dei tool esterni senza installarli automaticamente:

```bash
echo "=== Quality tools ==="
command -v knip &>/dev/null    && echo "OK knip"    || echo "MISS knip    — npm install -g knip"
command -v eslint &>/dev/null  && echo "OK eslint"  || echo "MISS eslint  — npm install -g eslint"
command -v tsc &>/dev/null     && echo "OK tsc"     || echo "MISS tsc     — npm install -g typescript"
command -v ruff &>/dev/null    && echo "OK ruff"    || echo "MISS ruff    — pip install ruff"
command -v mypy &>/dev/null    && echo "OK mypy"    || echo "MISS mypy    — pip install mypy"
command -v vulture &>/dev/null && echo "OK vulture" || echo "MISS vulture — pip install vulture"

echo "=== Security SAST ==="
command -v semgrep &>/dev/null && echo "OK semgrep" || echo "MISS semgrep — pip install semgrep"
command -v bearer &>/dev/null  && echo "OK bearer"  || echo "MISS bearer  — brew install bearer/tap/bearer"
command -v bandit &>/dev/null  && echo "OK bandit"  || echo "MISS bandit  — pip install bandit"

echo "=== Security SCA ==="
npm audit --version &>/dev/null 2>&1 && echo "OK npm audit (built-in)"
command -v osv-scanner &>/dev/null && echo "OK osv-scanner" || echo "MISS osv-scanner — brew install osv-scanner"
command -v retire &>/dev/null      && echo "OK retire"      || echo "MISS retire      — npm install -g retire"
command -v pip-audit &>/dev/null   && echo "OK pip-audit"   || echo "MISS pip-audit   — pip install pip-audit"
```

Se ci sono tool mancanti, chiedi all'utente se vuole installarli. Se si:
```bash
cd "$PLUGIN_DIR"
bash install.sh --tools-only
```

### Step 7: REPORT FINALE

Presenta un riepilogo:

```
## Aggiornamento completato

| Aspetto | Stato |
|---------|-------|
| Repository | OLD_COMMIT → NEW_COMMIT (N commit) |
| Skill installate | X/Y (Z nuove aggiunte) |
| Tool quality | X/6 disponibili |
| Tool security | X/7 disponibili |

### Novita in questa versione
[Estratto da CHANGELOG.md]

> Riavvia Claude Code per caricare le skill aggiornate.
```

## Note

- Questa skill NON installa tool automaticamente — mostra solo quelli mancanti e chiede conferma
- Se il repo non e in modalita symlink (installato con `--copy`), suggerisci di reinstallare con `bash install.sh`
- Se `git pull` fallisce, NON tentare operazioni distruttive — mostra l'errore e lascia decidere all'utente
- Dopo l'aggiornamento, ricorda all'utente di riavviare Claude Code
