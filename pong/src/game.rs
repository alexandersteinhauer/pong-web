use wasm_bindgen::prelude::*;

const FIELD_WIDTH: f64 = 800.0;
const FIELD_HEIGHT: f64 = 600.0;
const PADDLE_WIDTH: f64 = 10.0;
const PADDLE_HEIGHT: f64 = 100.0;
const PADDLE_OFFSET: f64 = 10.0;
const BALL_SPEED: f64 = 0.01;

#[wasm_bindgen]
pub struct Game {
    pub ball_x: f64,
    pub ball_y: f64,
    pub ball_angle: f64,
    pub left_paddle_y: f64,
    pub right_paddle_y: f64,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Game {
            ball_x: FIELD_WIDTH / 2.0,
            ball_y: FIELD_HEIGHT / 2.0,
            ball_angle: 0.0,
            left_paddle_y: FIELD_HEIGHT / 2.0,
            right_paddle_y: FIELD_HEIGHT / 2.0,
        }
    }

    pub fn update(&mut self, dt: f64) {
        let (sin, cos) = self.ball_angle.sin_cos();
        self.ball_x += BALL_SPEED * cos * dt;
        self.ball_y += BALL_SPEED * sin * dt;
    }
}
