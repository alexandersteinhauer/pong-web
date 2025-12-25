import init, { Game as WasmGame } from '$lib/wasm/pong';
import wasmUrl from '$lib/wasm/pong_bg.wasm?url';

let initialized = false;

export type { WasmGame as Game };

export async function initWasm(): Promise<void> {
	if (initialized) {
		return;
	}

	await init(wasmUrl);
	initialized = true;
}

export async function createGame(): Promise<WasmGame> {
	await initWasm();
	return new WasmGame();
}

// Game constants (mirrored from Rust)
export const FIELD_WIDTH = 800;
export const FIELD_HEIGHT = 600;
export const PADDLE_WIDTH = 10;
export const PADDLE_HEIGHT = 100;
export const PADDLE_OFFSET = 20;
export const BALL_SIZE = 10;
