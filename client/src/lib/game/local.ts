import { createGame, type Game } from "./wasm";

export interface LocalGameState {
  game: Game | null;
  running: boolean;
  winner: number; // -1 = no winner, 0 = left, 1 = right
}

export interface KeyState {
  w: boolean;
  s: boolean;
  ArrowUp: boolean;
  ArrowDown: boolean;
}

export function createKeyState(): KeyState {
  return {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  };
}

export function handleKeyDown(keys: KeyState, event: KeyboardEvent): boolean {
  if (event.key in keys) {
    keys[event.key as keyof KeyState] = true;
    event.preventDefault();
    return true;
  }
  return false;
}

export function handleKeyUp(keys: KeyState, event: KeyboardEvent): boolean {
  if (event.key in keys) {
    keys[event.key as keyof KeyState] = false;
    event.preventDefault();
    return true;
  }
  return false;
}

export function getLeftInput(keys: KeyState): number {
  let input = 0;
  if (keys.w) input -= 1;
  if (keys.s) input += 1;
  return input;
}

export function getRightInput(keys: KeyState): number {
  let input = 0;
  if (keys.ArrowUp) input -= 1;
  if (keys.ArrowDown) input += 1;
  return input;
}

export async function initLocalGame(): Promise<Game> {
  return await createGame();
}
