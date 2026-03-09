#!/usr/bin/env bash
# ============================================================================
# dev-methodology — Script di installazione rapida
# Plugin Claude Code per Spec-Driven Development (SDD)
# ============================================================================

set -euo pipefail

# Colori
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
BOLD='\033[1m'
NC='\033[0m' # No Color

PLUGIN_NAME="MUCC"
SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# ── Plugin: dev-methodology ──
DEV_SOURCE="$SCRIPT_DIR/dev-methodology/skills"
DEV_SKILLS=(
  dev-init
  dev-vision
  dev-prd
  dev-stories
  dev-spec
  dev-sprint
  dev-implement
  dev-validate
  dev-refactor
  dev-security
  dev-quick
  dev-review
  dev-pivot
  dev-status
  dev-sync
  dev-structure
  mucc-update
)

# ── Plugin: brainstorming ──
BS_SOURCE="$SCRIPT_DIR/brainstorming/skills"
BS_SKILLS=(
  bs-methodology
  bs-init
  bs-assess
  bs-run
  bs-brainstorm
  bs-chat
  bs-problem
  bs-research
  bs-scope
  bs-ux
  bs-architect
  bs-onboarding
  bs-security
  bs-performance
  bs-accessibility
  bs-analytics
  bs-copy
  bs-handoff
  bs-status
)

# ── Plugin: meetingmind ──
MM_SOURCE="$SCRIPT_DIR/meetingmind/skills"
MM_SKILLS=(
  meetingmind
)

# Tutti i prefissi skill per cleanup obsolete
ALL_PREFIXES=("dev-" "bs-" "mucc-" "meetingmind")

# ============================================================================
# Tool esterni per /dev-refactor e /dev-security
# ============================================================================

# Node.js tools (npm install -g)
NPM_TOOLS=(
  "knip"          # Dead code, unused deps/exports
  "eslint"        # Code quality, complexity
  "typescript"    # Type checking (tsc --noEmit)
  "retire"        # JS SCA — librerie con CVE note
)

# Python tools (pip install)
PIP_TOOLS=(
  "semgrep"       # SAST cross-language (OWASP Top 10)
  "ruff"          # Python quality + dead code (10-100x piu veloce di flake8)
  "mypy"          # Python type checking statico
  "vulture"       # Python dead code detection
  "bandit"        # Python SAST (47 security checks)
  "pip-audit"     # Python SCA (PyPI Advisory DB)
)

# Homebrew tools (macOS/Linux)
BREW_TAPS=("bearer/tap")
BREW_TOOLS=(
  "bearer/tap/bearer"   # SAST data flow, CWE Top 25, privacy
  "osv-scanner"         # SCA multi-ecosistema (Google OSV DB)
)

# ============================================================================
# Funzioni di utilità
# ============================================================================

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✔${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✖${NC}  $1"; }

print_banner() {
  echo ""
  echo -e "${BOLD}╔══════════════════════════════════════════╗${NC}"
  echo -e "${BOLD}║   MUCC Plugin Suite — Installer v0.5.2   ║${NC}"
  echo -e "${BOLD}║   dev-methodology + brainstorming + mm     ║${NC}"
  echo -e "${BOLD}╚══════════════════════════════════════════╝${NC}"
  echo ""
}

# ============================================================================
# Verifica prerequisiti
# ============================================================================

check_prerequisites() {
  local has_errors=0

  # Node.js >= 18
  if command -v node &>/dev/null; then
    local node_version
    node_version=$(node -v | sed 's/v//' | cut -d. -f1)
    if [ "$node_version" -ge 18 ]; then
      success "Node.js $(node -v) trovato"
    else
      error "Node.js >= 18 richiesto (trovato: $(node -v))"
      has_errors=1
    fi
  else
    error "Node.js non trovato. Installa Node.js >= 18: https://nodejs.org"
    has_errors=1
  fi

  # npx tsx disponibile
  if npx tsx --version &>/dev/null 2>&1; then
    success "npx tsx disponibile"
  else
    warn "npx tsx non trovato — verrà scaricato automaticamente al primo uso"
  fi

  # Claude Code installato (~/.claude/ esiste)
  if [ -d "$HOME/.claude" ]; then
    success "Claude Code rilevato (~/.claude/)"
  else
    error "Claude Code non rilevato. Installa Claude Code prima: https://claude.ai/code"
    has_errors=1
  fi

  # Sorgente plugin dev-methodology
  if [ -d "$DEV_SOURCE" ]; then
    success "Sorgente dev-methodology trovata"
  else
    error "Directory non trovata: $DEV_SOURCE"
    error "Esegui lo script dalla root del repository"
    has_errors=1
  fi

  # Sorgente plugin brainstorming
  if [ -d "$BS_SOURCE" ]; then
    success "Sorgente brainstorming trovata"
  else
    error "Directory non trovata: $BS_SOURCE"
    error "Esegui lo script dalla root del repository"
    has_errors=1
  fi

  # Sorgente plugin meetingmind
  if [ -d "$MM_SOURCE" ]; then
    success "Sorgente meetingmind trovata"
  else
    warn "Sorgente meetingmind non trovata (opzionale)"
  fi

  if [ "$has_errors" -eq 1 ]; then
    echo ""
    error "Prerequisiti mancanti. Correggi gli errori sopra e riprova."
    exit 1
  fi

  echo ""
}

# ============================================================================
# Installazione tool esterni (/dev-refactor + /dev-security)
# ============================================================================

# Determina il comando pip disponibile
detect_pip() {
  if command -v pip3 &>/dev/null; then
    echo "pip3"
  elif command -v pip &>/dev/null; then
    echo "pip"
  else
    echo ""
  fi
}

# Verifica se un comando è disponibile
is_installed() {
  command -v "$1" &>/dev/null
}

# Verifica se un pacchetto npm è installato globalmente
is_npm_installed() {
  npm list -g --depth=0 "$1" &>/dev/null 2>&1
}

install_tools() {
  echo -e "${BOLD}── Installazione tool per /dev-refactor e /dev-security ──${NC}"
  echo ""

  local npm_installed=0
  local npm_skipped=0
  local npm_failed=0
  local pip_installed=0
  local pip_skipped=0
  local pip_failed=0
  local brew_installed=0
  local brew_skipped=0
  local brew_failed=0

  # ── npm tools ──────────────────────────────────────────────
  info "Installazione tool npm (quality + security)..."
  for tool in "${NPM_TOOLS[@]}"; do
    # Controlla se il comando esiste già (installato globalmente o via npx)
    local cmd_name="$tool"
    # typescript si chiama "tsc" come comando
    [[ "$tool" == "typescript" ]] && cmd_name="tsc"

    if is_installed "$cmd_name" || is_npm_installed "$tool"; then
      success "$tool già installato"
      npm_skipped=$((npm_skipped + 1))
    else
      if npm install -g "$tool" &>/dev/null 2>&1; then
        success "$tool installato"
        npm_installed=$((npm_installed + 1))
      else
        warn "$tool — installazione fallita (verrà usato via npx come fallback)"
        npm_failed=$((npm_failed + 1))
      fi
    fi
  done
  echo ""

  # ── pip tools ──────────────────────────────────────────────
  local PIP_CMD
  PIP_CMD=$(detect_pip)

  if [ -n "$PIP_CMD" ]; then
    info "Installazione tool Python ($PIP_CMD) per quality + security..."
    for tool in "${PIP_TOOLS[@]}"; do
      local cmd_name="$tool"
      # pip-audit si chiama "pip-audit" come comando
      [[ "$tool" == "pip-audit" ]] && cmd_name="pip-audit"

      if is_installed "$cmd_name"; then
        success "$tool già installato"
        pip_skipped=$((pip_skipped + 1))
      else
        if $PIP_CMD install "$tool" &>/dev/null 2>&1; then
          success "$tool installato"
          pip_installed=$((pip_installed + 1))
        else
          # Riprova con --user se il primo tentativo fallisce (no virtualenv)
          if $PIP_CMD install --user "$tool" &>/dev/null 2>&1; then
            success "$tool installato (--user)"
            pip_installed=$((pip_installed + 1))
          else
            warn "$tool — installazione fallita"
            pip_failed=$((pip_failed + 1))
          fi
        fi
      fi
    done
  else
    warn "pip/pip3 non trovato — tool Python saltati"
    warn "Installa Python 3 per abilitare: semgrep, ruff, mypy, vulture, bandit, pip-audit"
    pip_skipped=${#PIP_TOOLS[@]}
  fi
  echo ""

  # ── brew tools ─────────────────────────────────────────────
  if command -v brew &>/dev/null; then
    info "Installazione tool Homebrew (SAST + SCA avanzati)..."

    # Aggiungi tap necessari
    for tap in "${BREW_TAPS[@]}"; do
      brew tap "$tap" &>/dev/null 2>&1 || true
    done

    for tool in "${BREW_TOOLS[@]}"; do
      # Estrai il nome del comando (dopo l'ultimo /)
      local cmd_name="${tool##*/}"

      if is_installed "$cmd_name"; then
        success "$cmd_name già installato"
        brew_skipped=$((brew_skipped + 1))
      else
        if brew install "$tool" &>/dev/null 2>&1; then
          success "$cmd_name installato"
          brew_installed=$((brew_installed + 1))
        else
          warn "$cmd_name — installazione fallita"
          brew_failed=$((brew_failed + 1))
        fi
      fi
    done
  else
    warn "Homebrew non trovato — tool opzionali saltati (bearer, osv-scanner)"
    warn "Installa Homebrew: https://brew.sh"
    brew_skipped=${#BREW_TOOLS[@]}
  fi

  # ── Riepilogo ──────────────────────────────────────────────
  echo ""
  echo -e "${BOLD}── Riepilogo tool ──${NC}"

  local total_installed=$((npm_installed + pip_installed + brew_installed))
  local total_skipped=$((npm_skipped + pip_skipped + brew_skipped))
  local total_failed=$((npm_failed + pip_failed + brew_failed))

  [ "$total_installed" -gt 0 ] && success "$total_installed tool installati"
  [ "$total_skipped" -gt 0 ] && info "$total_skipped tool già presenti"
  [ "$total_failed" -gt 0 ] && warn "$total_failed tool non installati (opzionali)"

  # npm audit è sempre disponibile
  echo ""
  info "npm audit: sempre disponibile (built-in npm)"

  # Tool minimi garantiti
  echo ""
  echo -e "${BOLD}Tool minimi per funzionamento:${NC}"
  local min_ok=true
  if is_installed "npx"; then
    success "npx — Knip, ESLint, tsc via npx (fallback se non globali)"
  fi
  if npm audit --version &>/dev/null 2>&1; then
    success "npm audit — SCA Node.js sempre disponibile"
  else
    warn "npm audit non disponibile"
    min_ok=false
  fi

  echo ""
  if [ "$total_failed" -gt 0 ]; then
    info "I tool mancanti sono opzionali. /dev-refactor e /dev-security"
    info "useranno i tool disponibili e AI reasoning come fallback."
  fi

  echo ""
}

# Mostra stato dei tool senza installare nulla
check_tools_status() {
  echo -e "${BOLD}── Stato tool per /dev-refactor e /dev-security ──${NC}"
  echo ""

  echo -e "${BOLD}Quality (/dev-refactor):${NC}"
  is_installed "knip"    && success "knip"    || warn "knip    — npm install -g knip"
  is_installed "eslint"  && success "eslint"  || warn "eslint  — npm install -g eslint"
  is_installed "tsc"     && success "tsc"     || warn "tsc     — npm install -g typescript"
  is_installed "ruff"    && success "ruff"    || warn "ruff    — pip install ruff"
  is_installed "mypy"    && success "mypy"    || warn "mypy    — pip install mypy"
  is_installed "vulture" && success "vulture" || warn "vulture — pip install vulture"
  echo ""

  echo -e "${BOLD}Security SAST (/dev-security):${NC}"
  is_installed "semgrep" && success "semgrep" || warn "semgrep — pip install semgrep"
  is_installed "bearer"  && success "bearer"  || warn "bearer  — brew install bearer/tap/bearer"
  is_installed "bandit"  && success "bandit"  || warn "bandit  — pip install bandit"
  echo ""

  echo -e "${BOLD}Security SCA (/dev-security):${NC}"
  npm audit --version &>/dev/null 2>&1 && success "npm audit (built-in)" || warn "npm audit"
  is_installed "osv-scanner" && success "osv-scanner" || warn "osv-scanner — brew install osv-scanner"
  is_installed "retire"      && success "retire"      || warn "retire      — npm install -g retire"
  is_installed "pip-audit"   && success "pip-audit"   || warn "pip-audit   — pip install pip-audit"
  echo ""
}

# ============================================================================
# Installazione
# ============================================================================

install_plugin() {
  local mode="${1:-symlink}"
  local skip_tools="${2:-false}"

  print_banner
  info "Verifica prerequisiti..."
  echo ""
  check_prerequisites

  # ── Installa tool esterni ──
  if [ "$skip_tools" = "false" ]; then
    install_tools
  else
    info "Installazione tool esterni saltata (--skip-tools)"
    echo ""
  fi

  # ── Installa skill ──
  echo -e "${BOLD}── Installazione skill Claude Code ──${NC}"
  echo ""

  # Crea directory skills se non esiste
  mkdir -p "$SKILLS_DIR"

  # Verifica se ci sono skill già installate
  local existing=0
  for skill in "${DEV_SKILLS[@]}" "${BS_SKILLS[@]}" "${MM_SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      existing=$((existing + 1))
    fi
  done

  if [ "$existing" -gt 0 ]; then
    warn "$existing skill già installate trovate"
    echo ""
    read -rp "Sovrascrivere? [s/N] " confirm
    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
      info "Installazione annullata."
      exit 0
    fi
  fi

  # Installa le skill dev-methodology
  echo ""
  local installed=0
  info "Plugin: dev-methodology (${#DEV_SKILLS[@]} skill)"
  for skill in "${DEV_SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
    fi
    if [ "$mode" = "copy" ]; then
      cp -r "$DEV_SOURCE/$skill" "$SKILLS_DIR/$skill"
    else
      ln -s "$DEV_SOURCE/$skill" "$SKILLS_DIR/$skill"
    fi
    installed=$((installed + 1))
  done
  success "${#DEV_SKILLS[@]} skill dev-methodology installate"

  # Installa le skill brainstorming
  echo ""
  info "Plugin: brainstorming (${#BS_SKILLS[@]} skill)"
  for skill in "${BS_SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
    fi
    if [ "$mode" = "copy" ]; then
      cp -r "$BS_SOURCE/$skill" "$SKILLS_DIR/$skill"
    else
      ln -s "$BS_SOURCE/$skill" "$SKILLS_DIR/$skill"
    fi
    installed=$((installed + 1))
  done
  success "${#BS_SKILLS[@]} skill brainstorming installate"

  # Installa le skill meetingmind
  if [ -d "$MM_SOURCE" ]; then
    echo ""
    info "Plugin: meetingmind (${#MM_SKILLS[@]} skill)"
    for skill in "${MM_SKILLS[@]}"; do
      if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
        rm -rf "$SKILLS_DIR/$skill"
      fi
      if [ "$mode" = "copy" ]; then
        cp -r "$MM_SOURCE/$skill" "$SKILLS_DIR/$skill"
      else
        ln -s "$MM_SOURCE/$skill" "$SKILLS_DIR/$skill"
      fi
      installed=$((installed + 1))
    done
    success "${#MM_SKILLS[@]} skill meetingmind installate"
  fi

  local total_skills=$((${#DEV_SKILLS[@]} + ${#BS_SKILLS[@]} + ${#MM_SKILLS[@]}))

  if [ "$mode" = "copy" ]; then
    success "$total_skills skill totali copiate in $SKILLS_DIR/"
  else
    success "$total_skills skill totali linkate in $SKILLS_DIR/"
  fi

  # ── Post-installazione ──
  echo ""
  echo -e "${GREEN}${BOLD}Installazione completata!${NC}"
  echo ""
  echo -e "${BOLD}dev-methodology (${#DEV_SKILLS[@]} skill):${NC}"
  for skill in "${DEV_SKILLS[@]}"; do
    echo "  /$skill"
  done
  echo ""
  echo -e "${BOLD}brainstorming (${#BS_SKILLS[@]} skill):${NC}"
  for skill in "${BS_SKILLS[@]}"; do
    echo "  /$skill"
  done
  if [ -d "$MM_SOURCE" ]; then
    echo ""
    echo -e "${BOLD}meetingmind (${#MM_SKILLS[@]} skill):${NC}"
    for skill in "${MM_SKILLS[@]}"; do
      echo "  /$skill"
    done
  fi
  echo ""
  echo -e "${BOLD}Prossimi passi:${NC}"
  echo "  1. Riavvia Claude Code (chiudi e riapri la sessione)"
  echo "  2. Brainstorming: /bs-init → /bs-assess → /bs-brainstorm → ..."
  echo "  3. Sviluppo: /dev-init → /dev-vision → /dev-prd → /dev-stories → ..."
  echo "  4. Qualità: /dev-refactor  |  Sicurezza: /dev-security"
  echo ""

  if [ "$mode" = "symlink" ]; then
    info "Modalità symlink: le modifiche al repo si riflettono automaticamente."
  else
    info "Modalità copia: per aggiornare, riesegui: bash install.sh --copy"
  fi
  echo ""
}

# ============================================================================
# Aggiornamento
# ============================================================================

update_plugin() {
  local skip_tools="${1:-false}"

  print_banner
  info "Aggiornamento $PLUGIN_NAME..."
  echo ""

  # ── Git pull (se siamo in un repo git) ──
  if [ -d "$SCRIPT_DIR/.git" ]; then
    info "Aggiornamento repo da remote..."
    if git -C "$SCRIPT_DIR" pull --ff-only 2>/dev/null; then
      success "Repository aggiornato"
    else
      warn "git pull fallito — continuo con la versione locale"
      warn "Esegui manualmente: cd $SCRIPT_DIR && git pull"
    fi
    echo ""
  fi

  check_prerequisites

  # ── Aggiorna tool esterni ──
  if [ "$skip_tools" = "false" ]; then
    install_tools
  else
    info "Aggiornamento tool esterni saltato (--skip-tools)"
    echo ""
  fi

  # ── Aggiorna skill ──
  echo -e "${BOLD}── Aggiornamento skill Claude Code ──${NC}"
  echo ""

  mkdir -p "$SKILLS_DIR"

  local added=0
  local updated=0
  local unchanged=0

  # Funzione helper per aggiornare skill da una sorgente
  _update_skills() {
    local source_dir="$1"
    shift
    local skills=("$@")

    for skill in "${skills[@]}"; do
      if [ -L "$SKILLS_DIR/$skill" ]; then
        local current_target
        current_target=$(readlink "$SKILLS_DIR/$skill" 2>/dev/null || echo "")
        local expected_target="$source_dir/$skill"

        if [ "$current_target" = "$expected_target" ]; then
          unchanged=$((unchanged + 1))
        else
          rm -f "$SKILLS_DIR/$skill"
          ln -s "$expected_target" "$SKILLS_DIR/$skill"
          updated=$((updated + 1))
          success "$skill — symlink aggiornato"
        fi
      elif [ -d "$SKILLS_DIR/$skill" ]; then
        rm -rf "$SKILLS_DIR/$skill"
        cp -r "$source_dir/$skill" "$SKILLS_DIR/$skill"
        updated=$((updated + 1))
        success "$skill — aggiornato (copy)"
      else
        ln -s "$source_dir/$skill" "$SKILLS_DIR/$skill"
        added=$((added + 1))
        success "$skill — NUOVA skill aggiunta"
      fi
    done
  }

  info "Plugin: dev-methodology"
  _update_skills "$DEV_SOURCE" "${DEV_SKILLS[@]}"
  echo ""
  info "Plugin: brainstorming"
  _update_skills "$BS_SOURCE" "${BS_SKILLS[@]}"
  if [ -d "$MM_SOURCE" ]; then
    echo ""
    info "Plugin: meetingmind"
    _update_skills "$MM_SOURCE" "${MM_SKILLS[@]}"
  fi

  # ── Rimuovi skill obsolete non più negli array ──
  local removed=0
  for prefix in "${ALL_PREFIXES[@]}"; do
    for existing in "$SKILLS_DIR"/${prefix}*; do
      [ -e "$existing" ] || [ -L "$existing" ] || continue
      local skill_name
      skill_name=$(basename "$existing")
      local found=false
      for skill in "${DEV_SKILLS[@]}" "${BS_SKILLS[@]}" "${MM_SKILLS[@]}"; do
        if [ "$skill" = "$skill_name" ]; then
          found=true
          break
        fi
      done
      if [ "$found" = "false" ]; then
        if [ -L "$existing" ]; then
          local target
          target=$(readlink "$existing" 2>/dev/null || echo "")
          if [[ "$target" == *"plugin"* ]] || [[ "$target" == *"MUCC"* ]]; then
            rm -f "$existing"
            removed=$((removed + 1))
            warn "$skill_name — skill rimossa (non più nel plugin)"
          fi
        fi
      fi
    done
  done

  # ── Riepilogo ──
  echo ""
  [ "$added" -gt 0 ] && success "$added nuove skill aggiunte"
  [ "$updated" -gt 0 ] && success "$updated skill aggiornate"
  [ "$unchanged" -gt 0 ] && info "$unchanged skill già aggiornate (symlink OK)"
  [ "$removed" -gt 0 ] && warn "$removed skill obsolete rimosse"

  local total_skills=$((${#DEV_SKILLS[@]} + ${#BS_SKILLS[@]} + ${#MM_SKILLS[@]}))
  echo ""
  echo -e "${GREEN}${BOLD}Aggiornamento completato!${NC}"
  echo ""
  echo -e "${BOLD}Skill attive ($total_skills):${NC}"
  echo "  dev-methodology: ${#DEV_SKILLS[@]} skill"
  echo "  brainstorming:   ${#BS_SKILLS[@]} skill"
  echo "  meetingmind:     ${#MM_SKILLS[@]} skill"
  echo ""
  info "Riavvia Claude Code per applicare le modifiche."
  echo ""
}

# ============================================================================
# Disinstallazione
# ============================================================================

uninstall_plugin() {
  print_banner
  info "Disinstallazione $PLUGIN_NAME..."
  echo ""

  local found=0
  for skill in "${DEV_SKILLS[@]}" "${BS_SKILLS[@]}" "${MM_SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      found=$((found + 1))
    fi
  done

  if [ "$found" -eq 0 ]; then
    warn "Nessuna skill MUCC trovata — nulla da rimuovere."
    echo ""
    return
  fi

  info "$found skill trovate"
  echo ""
  read -rp "Confermi la rimozione? [s/N] " confirm
  if [[ ! "$confirm" =~ ^[sS]$ ]]; then
    info "Disinstallazione annullata."
    exit 0
  fi

  local removed=0
  for skill in "${DEV_SKILLS[@]}" "${BS_SKILLS[@]}" "${MM_SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
      removed=$((removed + 1))
    fi
  done

  success "$removed skill rimosse da $SKILLS_DIR/"
  echo ""
  info "I tool esterni (semgrep, knip, etc.) non vengono rimossi."
  info "Per rimuoverli: npm uninstall -g knip eslint typescript retire"
  info "                pip uninstall semgrep ruff mypy vulture bandit pip-audit"
  info ""
  info "Riavvia Claude Code per completare la disinstallazione."
  echo ""
}

# ============================================================================
# Help
# ============================================================================

show_help() {
  print_banner
  echo "Uso:"
  echo "  bash install.sh              Installa skill + tool (default, consigliato)"
  echo "  bash install.sh --update     Aggiorna: git pull + nuove skill + nuovi tool"
  echo "  bash install.sh --copy       Installa con copia dei file + tool"
  echo "  bash install.sh --skip-tools Installa solo skill, senza tool esterni"
  echo "  bash install.sh --check      Verifica quali tool sono installati"
  echo "  bash install.sh --tools-only Installa solo i tool esterni"
  echo "  bash install.sh --uninstall  Disinstalla il plugin (skill, non tool)"
  echo "  bash install.sh --help       Mostra questo messaggio"
  echo ""
  echo "Modalità:"
  echo "  symlink (default)  Crea link simbolici in ~/.claude/skills/."
  echo "                     Le modifiche al repo si riflettono automaticamente."
  echo "                     Ideale per sviluppo."
  echo "  copy (--copy)      Copia i file in ~/.claude/skills/."
  echo "                     Installazione indipendente dal repo."
  echo "                     Serve rieseguire lo script per aggiornare."
  echo ""
  echo "Aggiornamento:"
  echo "  --update           Esegue git pull, aggiunge nuove skill, aggiorna"
  echo "                     symlink se necessario, installa nuovi tool."
  echo "                     Non chiede conferma — sicuro da eseguire sempre."
  echo ""
  echo "Tool esterni installati:"
  echo "  Quality:  knip, eslint, typescript, ruff, mypy, vulture"
  echo "  Security: semgrep, bearer, bandit, retire, osv-scanner, pip-audit"
  echo "  Sempre:   npm audit (built-in npm)"
  echo ""
}

# ============================================================================
# Main
# ============================================================================

case "${1:-}" in
  --update)
    update_plugin "false"
    ;;
  --update-skip-tools)
    update_plugin "true"
    ;;
  --copy)
    install_plugin "copy" "false"
    ;;
  --skip-tools)
    install_plugin "symlink" "true"
    ;;
  --tools-only)
    print_banner
    install_tools
    ;;
  --check)
    print_banner
    check_tools_status
    ;;
  --uninstall)
    uninstall_plugin
    ;;
  --help|-h)
    show_help
    ;;
  "")
    install_plugin "symlink" "false"
    ;;
  *)
    error "Opzione non riconosciuta: $1"
    echo ""
    show_help
    exit 1
    ;;
esac
