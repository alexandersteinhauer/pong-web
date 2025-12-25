# Deployment Guide

## Server Details

- **Host**: `ssh pong` (188.245.105.44)
- **Domain**: https://pong.st1.io
- **WebTransport**: quic://pong.st1.io:4433

## Quick Deploy

### Full redeploy (client + server)

```bash
# Sync files
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' --exclude '.cert' . pong:/opt/pong/

# Rebuild and restart on server
ssh pong "
  source ~/.cargo/env
  export PATH=\$PATH:~/.bun/bin

  # Rebuild server
  cd /opt/pong/server && cargo build --release

  # Rebuild client
  cd /opt/pong/client
  sed -i 's|adapter-auto|adapter-node|' svelte.config.js
  bun install
  VITE_SERVER_URL='https://pong.st1.io:4433' bun run build

  # Restart services
  systemctl restart pong-server pong-client
"
```

### Client only (UI changes)

```bash
rsync -avz --exclude 'node_modules' --exclude 'target' --exclude '.git' client/ pong:/opt/pong/client/

ssh pong "
  export PATH=\$PATH:~/.bun/bin
  cd /opt/pong/client
  sed -i 's|adapter-auto|adapter-node|' svelte.config.js
  VITE_SERVER_URL='https://pong.st1.io:4433' bun run build
  systemctl restart pong-client
"
```

### Server only (game logic changes)

```bash
rsync -avz --exclude 'target' pong/ pong:/opt/pong/pong/
rsync -avz --exclude 'target' server/ pong:/opt/pong/server/

ssh pong "
  source ~/.cargo/env
  cd /opt/pong/server && cargo build --release
  systemctl restart pong-server
"
```

### WASM changes (affects both client & server)

```bash
# Build WASM locally
cd pong && wasm-pack build --target web --release

# Copy to client
cp pong/pkg/* client/src/lib/wasm/

# Then do full redeploy (see above)
```

## Services

```bash
# Check status
ssh pong "systemctl status pong-server pong-client nginx"

# View logs
ssh pong "journalctl -u pong-server -f"
ssh pong "journalctl -u pong-client -f"

# Restart
ssh pong "systemctl restart pong-server pong-client"
```

## Configuration

### Environment Variables

The server uses these env vars (set in systemd service):

- `TLS_CERT` - Path to SSL certificate (default: `../cert/cert.pem`)
- `TLS_KEY` - Path to SSL private key (default: `../cert/key.pem`)

Production values are set in `/etc/systemd/system/pong-server.service`:

```
TLS_CERT=/etc/letsencrypt/live/pong.st1.io/fullchain.pem
TLS_KEY=/etc/letsencrypt/live/pong.st1.io/privkey.pem
```

### SSL Certificate

Let's Encrypt certificate auto-renews via certbot. To manually renew:

```bash
ssh pong "certbot renew && systemctl restart pong-server nginx"
```

## Ports

| Service              | Port | Protocol |
| -------------------- | ---- | -------- |
| nginx (HTTP)         | 80   | TCP      |
| nginx (HTTPS)        | 443  | TCP      |
| WebTransport         | 4433 | UDP      |
| SvelteKit (internal) | 3000 | TCP      |
