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
PLUGIN_REGISTRY_KEY="dev-methodology@MaxGiu67-plugin-MUCC"
PLUGIN_DIR="$HOME/.claude/plugins/$PLUGIN_NAME"
INSTALLED_PLUGINS="$HOME/.claude/plugins/installed_plugins.json"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$SCRIPT_DIR/dev-methodology"

# ============================================================================
# Funzioni di utilità
# ============================================================================

info()    { echo -e "${BLUE}ℹ${NC}  $1"; }
success() { echo -e "${GREEN}✔${NC}  $1"; }
warn()    { echo -e "${YELLOW}⚠${NC}  $1"; }
error()   { echo -e "${RED}✖${NC}  $1"; }

# Registra il plugin in installed_plugins.json
register_plugin() {
  local install_path="$1"
  local now
  now=$(date -u +"%Y-%m-%dT%H:%M:%S.000Z")

  if [ ! -f "$INSTALLED_PLUGINS" ]; then
    # Crea il file da zero
    cat > "$INSTALLED_PLUGINS" <<JSONEOF
{
  "version": 2,
  "plugins": {
    "$PLUGIN_REGISTRY_KEY": [
      {
        "scope": "user",
        "installPath": "$install_path",
        "version": "1.0.0",
        "installedAt": "$now",
        "lastUpdated": "$now"
      }
    ]
  }
}
JSONEOF
    success "Registry creato: $INSTALLED_PLUGINS"
    return
  fi

  # Rimuovi entry esistente se presente, poi aggiungi la nuova
  local tmp_file
  tmp_file=$(mktemp)

  if command -v python3 &>/dev/null; then
    python3 -c "
import json, sys
with open('$INSTALLED_PLUGINS', 'r') as f:
    data = json.load(f)
data.setdefault('plugins', {})
data['plugins']['$PLUGIN_REGISTRY_KEY'] = [{
    'scope': 'user',
    'installPath': '$install_path',
    'version': '1.0.0',
    'installedAt': '$now',
    'lastUpdated': '$now'
}]
with open('$tmp_file', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
"
    mv "$tmp_file" "$INSTALLED_PLUGINS"
    success "Plugin registrato in installed_plugins.json"
  else
    warn "python3 non trovato — registrazione automatica non disponibile"
    warn "Il plugin è installato ma potrebbe non comparire in /plugin list"
    rm -f "$tmp_file"
  fi
}

# Rimuovi il plugin da installed_plugins.json
unregister_plugin() {
  if [ ! -f "$INSTALLED_PLUGINS" ]; then
    return
  fi

  if command -v python3 &>/dev/null; then
    local tmp_file
    tmp_file=$(mktemp)
    python3 -c "
import json
with open('$INSTALLED_PLUGINS', 'r') as f:
    data = json.load(f)
data.get('plugins', {}).pop('$PLUGIN_REGISTRY_KEY', None)
with open('$tmp_file', 'w') as f:
    json.dump(data, f, indent=2)
    f.write('\n')
"
    mv "$tmp_file" "$INSTALLED_PLUGINS"
    success "Plugin rimosso da installed_plugins.json"
  fi
}

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

  # Crea directory plugins se non esiste
  mkdir -p "$HOME/.claude/plugins"

  # Gestisci installazione esistente
  if [ -e "$PLUGIN_DIR" ] || [ -L "$PLUGIN_DIR" ]; then
    warn "Installazione esistente trovata: $PLUGIN_DIR"

    if [ -L "$PLUGIN_DIR" ]; then
      local target
      target=$(readlink "$PLUGIN_DIR")
      info "  Tipo: symlink -> $target"
    else
      info "  Tipo: copia"
    fi

    echo ""
    read -rp "Sovrascrivere? [s/N] " confirm
    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
      info "Installazione annullata."
      exit 0
    fi

    # Rimuovi installazione esistente
    rm -rf "$PLUGIN_DIR"
    success "Installazione precedente rimossa"
  fi

  # Installa in base alla modalità
  echo ""
  if [ "$mode" = "copy" ]; then
    info "Installazione in modalità copia..."
    cp -r "$SOURCE_DIR" "$PLUGIN_DIR"
    success "Plugin copiato in $PLUGIN_DIR"
  else
    info "Installazione in modalità symlink..."
    ln -s "$SOURCE_DIR" "$PLUGIN_DIR"
    success "Symlink creato: $PLUGIN_DIR -> $SOURCE_DIR"
  fi

  # Registra in installed_plugins.json
  register_plugin "$PLUGIN_DIR"

  # Post-installazione
  echo ""
  echo -e "${GREEN}${BOLD}Installazione completata!${NC}"
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

  if [ -e "$PLUGIN_DIR" ] || [ -L "$PLUGIN_DIR" ]; then
    if [ -L "$PLUGIN_DIR" ]; then
      info "Tipo: symlink (la sorgente non verrà toccata)"
    else
      info "Tipo: copia"
    fi

    echo ""
    read -rp "Confermi la rimozione di $PLUGIN_DIR? [s/N] " confirm
    if [[ ! "$confirm" =~ ^[sS]$ ]]; then
      info "Disinstallazione annullata."
      exit 0
    fi

    rm -rf "$PLUGIN_DIR"
    success "Plugin rimosso da $PLUGIN_DIR"

    # Rimuovi dal registry
    unregister_plugin

    echo ""
    info "Riavvia Claude Code per completare la disinstallazione."
  else
    warn "Plugin non trovato in $PLUGIN_DIR — nulla da rimuovere."
  fi
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
  echo "  symlink (default)  Crea un link simbolico. Le modifiche al repo si"
  echo "                     riflettono automaticamente. Ideale per sviluppo."
  echo "  copy (--copy)      Copia i file. Installazione indipendente dal repo."
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
