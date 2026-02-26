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

PLUGIN_NAME="dev-methodology"
SKILLS_DIR="$HOME/.claude/skills"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/dev-methodology"
SKILLS_SOURCE="$SOURCE_DIR/skills"

# Lista delle skill da installare
SKILLS=(
  dev-init
  dev-vision
  dev-prd
  dev-stories
  dev-spec
  dev-sprint
  dev-implement
  dev-validate
  dev-status
  dev-sync
  dev-structure
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
  echo -e "${BOLD}║   dev-methodology — Installer v1.0.0     ║${NC}"
  echo -e "${BOLD}║   Spec-Driven Development per Claude Code ║${NC}"
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

  # Sorgente plugin esiste
  if [ -d "$SOURCE_DIR" ]; then
    success "Sorgente plugin trovata: $SOURCE_DIR"
  else
    error "Directory sorgente non trovata: $SOURCE_DIR"
    error "Esegui lo script dalla root del repository"
    has_errors=1
  fi

  if [ "$has_errors" -eq 1 ]; then
    echo ""
    error "Prerequisiti mancanti. Correggi gli errori sopra e riprova."
    exit 1
  fi

  echo ""
}

# ============================================================================
# Installazione
# ============================================================================

install_plugin() {
  local mode="${1:-symlink}"

  print_banner
  info "Verifica prerequisiti..."
  echo ""
  check_prerequisites

  # Crea directory skills se non esiste
  mkdir -p "$SKILLS_DIR"

  # Verifica se ci sono skill già installate
  local existing=0
  for skill in "${SKILLS[@]}"; do
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

  # Installa le skill
  echo ""
  local installed=0
  for skill in "${SKILLS[@]}"; do
    # Rimuovi eventuale installazione esistente
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
    fi

    if [ "$mode" = "copy" ]; then
      cp -r "$SKILLS_SOURCE/$skill" "$SKILLS_DIR/$skill"
    else
      ln -s "$SKILLS_SOURCE/$skill" "$SKILLS_DIR/$skill"
    fi
    installed=$((installed + 1))
  done

  if [ "$mode" = "copy" ]; then
    success "$installed skill copiate in $SKILLS_DIR/"
  else
    success "$installed skill linkate in $SKILLS_DIR/"
  fi

  # Post-installazione
  echo ""
  echo -e "${GREEN}${BOLD}Installazione completata!${NC}"
  echo ""
  echo -e "${BOLD}Skill installate:${NC}"
  for skill in "${SKILLS[@]}"; do
    echo "  /$skill"
  done
  echo ""
  echo -e "${BOLD}Prossimi passi:${NC}"
  echo "  1. Riavvia Claude Code (chiudi e riapri la sessione)"
  echo "  2. Usa /dev-init per inizializzare un nuovo progetto"
  echo "  3. Segui il workflow: /dev-vision → /dev-prd → /dev-stories → ..."
  echo ""

  if [ "$mode" = "symlink" ]; then
    info "Modalità symlink: le modifiche al repo si riflettono automaticamente."
  else
    info "Modalità copia: per aggiornare, riesegui: bash install.sh --copy"
  fi
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
  for skill in "${SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      found=$((found + 1))
    fi
  done

  if [ "$found" -eq 0 ]; then
    warn "Nessuna skill dev-methodology trovata — nulla da rimuovere."
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
  for skill in "${SKILLS[@]}"; do
    if [ -e "$SKILLS_DIR/$skill" ] || [ -L "$SKILLS_DIR/$skill" ]; then
      rm -rf "$SKILLS_DIR/$skill"
      removed=$((removed + 1))
    fi
  done

  success "$removed skill rimosse da $SKILLS_DIR/"
  echo ""
  info "Riavvia Claude Code per completare la disinstallazione."
  echo ""
}

# ============================================================================
# Help
# ============================================================================

show_help() {
  print_banner
  echo "Uso:"
  echo "  bash install.sh              Installa con symlink (default, consigliato)"
  echo "  bash install.sh --copy       Installa con copia dei file"
  echo "  bash install.sh --uninstall  Disinstalla il plugin"
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
}

# ============================================================================
# Main
# ============================================================================

case "${1:-}" in
  --copy)
    install_plugin "copy"
    ;;
  --uninstall)
    uninstall_plugin
    ;;
  --help|-h)
    show_help
    ;;
  "")
    install_plugin "symlink"
    ;;
  *)
    error "Opzione non riconosciuta: $1"
    echo ""
    show_help
    exit 1
    ;;
esac
