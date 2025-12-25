#!/usr/bin/env bash
set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REMOTE="pong"
REMOTE_PATH="/opt/pong"
SERVER_URL="https://pong.st1.io:4433"

print_usage() {
    echo "Usage: $0 [command]"
    echo ""
    echo "Commands:"
    echo "  full      Full redeploy (client + server + proto)"
    echo "  client    Client only (UI changes)"
    echo "  server    Server only (game logic changes)"
    echo "  wasm      Rebuild WASM and do full redeploy"
    echo "  proto     Regenerate protobuf files only"
    echo "  status    Check service status"
    echo "  logs      View server logs"
    echo ""
    echo "If no command is given, defaults to 'full'"
}

log() {
    echo -e "${GREEN}[deploy]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[deploy]${NC} $1"
}

error() {
    echo -e "${RED}[deploy]${NC} $1"
    exit 1
}

regenerate_proto() {
    log "Regenerating protobuf files..."
    cd client && bun run proto && cd ..
    log "Protobuf files regenerated"
}

deploy_full() {
    log "Starting full deployment..."

    # Regenerate proto files locally
    regenerate_proto

    log "Syncing files to remote..."
    rsync -avz --delete \
        --exclude 'node_modules' \
        --exclude 'target' \
        --exclude '.git' \
        --exclude '.cert' \
        --exclude 'cert' \
        . "$REMOTE:$REMOTE_PATH/"

    log "Building and restarting services on remote..."
    ssh "$REMOTE" "
        set -e
        source ~/.cargo/env
        export PATH=\$PATH:~/.bun/bin

        # Rebuild server
        echo '==> Building server...'
        cd $REMOTE_PATH/server && cargo build --release

        # Rebuild client
        echo '==> Building client...'
        cd $REMOTE_PATH/client
        sed -i 's|adapter-auto|adapter-node|' svelte.config.js
        bun install
        VITE_SERVER_URL='$SERVER_URL' bun run build

        # Restart services
        echo '==> Restarting services...'
        sudo systemctl restart pong-server pong-client

        echo '==> Done!'
    "

    log "Full deployment complete!"
}

deploy_client() {
    log "Starting client deployment..."

    # Regenerate proto files locally
    regenerate_proto

    log "Syncing client files to remote..."
    rsync -avz --delete \
        --exclude 'node_modules' \
        client/ "$REMOTE:$REMOTE_PATH/client/"

    log "Building and restarting client on remote..."
    ssh "$REMOTE" "
        set -e
        export PATH=\$PATH:~/.bun/bin
        cd $REMOTE_PATH/client
        sed -i 's|adapter-auto|adapter-node|' svelte.config.js
        bun install
        VITE_SERVER_URL='$SERVER_URL' bun run build
        sudo systemctl restart pong-client
    "

    log "Client deployment complete!"
}

deploy_server() {
    log "Starting server deployment..."

    log "Syncing server files to remote..."
    rsync -avz --delete --exclude 'target' pong/ "$REMOTE:$REMOTE_PATH/pong/"
    rsync -avz --delete --exclude 'target' server/ "$REMOTE:$REMOTE_PATH/server/"
    rsync -avz proto/ "$REMOTE:$REMOTE_PATH/proto/"

    log "Building and restarting server on remote..."
    ssh "$REMOTE" "
        set -e
        source ~/.cargo/env
        cd $REMOTE_PATH/server && cargo build --release
        sudo systemctl restart pong-server
    "

    log "Server deployment complete!"
}

deploy_wasm() {
    log "Building WASM locally..."
    cd pong && wasm-pack build --target web --release && cd ..

    log "Copying WASM to client..."
    cp pong/pkg/* client/src/lib/wasm/

    log "Proceeding with full deployment..."
    deploy_full
}

check_status() {
    log "Checking service status..."
    ssh "$REMOTE" "systemctl status pong-server pong-client nginx --no-pager"
}

view_logs() {
    log "Viewing server logs (Ctrl+C to exit)..."
    ssh "$REMOTE" "journalctl -u pong-server -f"
}

# Main
case "${1:-full}" in
    full)
        deploy_full
        ;;
    client)
        deploy_client
        ;;
    server)
        deploy_server
        ;;
    wasm)
        deploy_wasm
        ;;
    proto)
        regenerate_proto
        ;;
    status)
        check_status
        ;;
    logs)
        view_logs
        ;;
    -h|--help|help)
        print_usage
        ;;
    *)
        error "Unknown command: $1"
        print_usage
        exit 1
        ;;
esac

