/* tslint:disable */
/* eslint-disable */

export class Game {
  free(): void;
  [Symbol.dispose](): void;
  field_width(): number;
  /**
   * Launch the ball - called by the serving player
   * side: 0 = left, 1 = right
   * Returns true if the serve was accepted
   */
  launch_ball(side: number): boolean;
  field_height(): number;
  is_game_over(): boolean;
  paddle_width(): number;
  paddle_height(): number;
  paddle_offset(): number;
  constructor();
  reset(): void;
  update(dt: number): void;
  /**
   * Returns the winner: 0 = left, 1 = right, -1 = no winner yet
   */
  winner(): number;
  ball_size(): number;
  ball_x: number;
  ball_y: number;
  ball_vx: number;
  ball_vy: number;
  ball_speed: number;
  left_paddle_y: number;
  right_paddle_y: number;
  left_paddle_input: number;
  right_paddle_input: number;
  left_score: number;
  right_score: number;
  /**
   * True when waiting for the losing player to serve
   */
  waiting_for_serve: boolean;
  /**
   * Which side should serve: 0 = left, 1 = right
   */
  serving_side: number;
}

export type InitInput =
  | RequestInfo
  | URL
  | Response
  | BufferSource
  | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_game_free: (a: number, b: number) => void;
  readonly __wbg_get_game_ball_speed: (a: number) => number;
  readonly __wbg_get_game_ball_vx: (a: number) => number;
  readonly __wbg_get_game_ball_vy: (a: number) => number;
  readonly __wbg_get_game_ball_x: (a: number) => number;
  readonly __wbg_get_game_ball_y: (a: number) => number;
  readonly __wbg_get_game_left_paddle_input: (a: number) => number;
  readonly __wbg_get_game_left_paddle_y: (a: number) => number;
  readonly __wbg_get_game_left_score: (a: number) => number;
  readonly __wbg_get_game_right_paddle_input: (a: number) => number;
  readonly __wbg_get_game_right_paddle_y: (a: number) => number;
  readonly __wbg_get_game_right_score: (a: number) => number;
  readonly __wbg_get_game_serving_side: (a: number) => number;
  readonly __wbg_get_game_waiting_for_serve: (a: number) => number;
  readonly __wbg_set_game_ball_speed: (a: number, b: number) => void;
  readonly __wbg_set_game_ball_vx: (a: number, b: number) => void;
  readonly __wbg_set_game_ball_vy: (a: number, b: number) => void;
  readonly __wbg_set_game_ball_x: (a: number, b: number) => void;
  readonly __wbg_set_game_ball_y: (a: number, b: number) => void;
  readonly __wbg_set_game_left_paddle_input: (a: number, b: number) => void;
  readonly __wbg_set_game_left_paddle_y: (a: number, b: number) => void;
  readonly __wbg_set_game_left_score: (a: number, b: number) => void;
  readonly __wbg_set_game_right_paddle_input: (a: number, b: number) => void;
  readonly __wbg_set_game_right_paddle_y: (a: number, b: number) => void;
  readonly __wbg_set_game_right_score: (a: number, b: number) => void;
  readonly __wbg_set_game_serving_side: (a: number, b: number) => void;
  readonly __wbg_set_game_waiting_for_serve: (a: number, b: number) => void;
  readonly game_ball_size: (a: number) => number;
  readonly game_field_height: (a: number) => number;
  readonly game_field_width: (a: number) => number;
  readonly game_is_game_over: (a: number) => number;
  readonly game_launch_ball: (a: number, b: number) => number;
  readonly game_new: () => number;
  readonly game_paddle_height: (a: number) => number;
  readonly game_paddle_offset: (a: number) => number;
  readonly game_reset: (a: number) => void;
  readonly game_update: (a: number, b: number) => void;
  readonly game_winner: (a: number) => number;
  readonly game_paddle_width: (a: number) => number;
  readonly __wbindgen_externrefs: WebAssembly.Table;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(
  module: { module: SyncInitInput } | SyncInitInput,
): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init(
  module_or_path?:
    | { module_or_path: InitInput | Promise<InitInput> }
    | InitInput
    | Promise<InitInput>,
): Promise<InitOutput>;
