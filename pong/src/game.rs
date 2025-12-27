use wasm_bindgen::prelude::*;

const FIELD_WIDTH: f64 = 800.0;
const FIELD_HEIGHT: f64 = 600.0;
const PADDLE_WIDTH: f64 = 10.0;
const PADDLE_HEIGHT: f64 = 100.0;
const PADDLE_OFFSET: f64 = 20.0;
const PADDLE_SPEED: f64 = 600.0;
const BALL_SIZE: f64 = 10.0;
const INITIAL_BALL_SPEED: f64 = 400.0;
const BALL_SPEED_INCREMENT: f64 = 20.0;
const MAX_BOUNCE_ANGLE: f64 = std::f64::consts::PI / 3.0; // 60 degrees
const WINNING_SCORE: u32 = 7;

#[derive(Clone, Copy)]
struct AABB {
    x: f64,
    y: f64,
    w: f64,
    h: f64,
}

impl AABB {
    fn new(x: f64, y: f64, w: f64, h: f64) -> Self {
        Self { x, y, w, h }
    }

    fn left(&self) -> f64 {
        self.x
    }
    fn right(&self) -> f64 {
        self.x + self.w
    }
    fn top(&self) -> f64 {
        self.y
    }
    fn bottom(&self) -> f64 {
        self.y + self.h
    }
}

#[derive(Clone, Copy)]
struct SweptResult {
    t: f64,
    normal_x: f64,
}

fn swept_aabb(moving: AABB, vel: (f64, f64), stationary: AABB) -> Option<SweptResult> {
    let (vx, vy) = vel;

    if vx == 0.0 && vy == 0.0 {
        return None;
    }

    let (x_entry, x_exit, nx) = if vx > 0.0 {
        (
            (stationary.left() - moving.right()) / vx,
            (stationary.right() - moving.left()) / vx,
            -1.0,
        )
    } else if vx < 0.0 {
        (
            (stationary.right() - moving.left()) / vx,
            (stationary.left() - moving.right()) / vx,
            1.0,
        )
    } else {
        if moving.right() <= stationary.left() || moving.left() >= stationary.right() {
            return None;
        }
        (f64::NEG_INFINITY, f64::INFINITY, 0.0)
    };

    let (y_entry, y_exit) = if vy > 0.0 {
        (
            (stationary.top() - moving.bottom()) / vy,
            (stationary.bottom() - moving.top()) / vy,
        )
    } else if vy < 0.0 {
        (
            (stationary.bottom() - moving.top()) / vy,
            (stationary.top() - moving.bottom()) / vy,
        )
    } else {
        if moving.bottom() <= stationary.top() || moving.top() >= stationary.bottom() {
            return None;
        }
        (f64::NEG_INFINITY, f64::INFINITY)
    };

    let entry_time = x_entry.max(y_entry);
    let exit_time = x_exit.min(y_exit);

    if entry_time > exit_time || entry_time < 0.0 || entry_time > 1.0 {
        return None;
    }

    let normal_x = if x_entry > y_entry { nx } else { 0.0 };

    Some(SweptResult {
        t: entry_time,
        normal_x,
    })
}

#[wasm_bindgen]
pub struct Game {
    pub ball_x: f64,
    pub ball_y: f64,
    pub ball_vx: f64,
    pub ball_vy: f64,
    pub ball_speed: f64,
    pub left_paddle_y: f64,
    pub right_paddle_y: f64,
    pub left_paddle_input: f64,
    pub right_paddle_input: f64,
    pub left_score: u32,
    pub right_score: u32,
    /// True when waiting for the losing player to serve
    pub waiting_for_serve: bool,
    /// Which side should serve: 0 = left, 1 = right
    pub serving_side: i32,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        let angle = std::f64::consts::PI * 0.25;
        Game {
            ball_x: FIELD_WIDTH / 2.0 - BALL_SIZE / 2.0,
            ball_y: FIELD_HEIGHT / 2.0 - BALL_SIZE / 2.0,
            ball_vx: INITIAL_BALL_SPEED * angle.cos(),
            ball_vy: INITIAL_BALL_SPEED * angle.sin(),
            ball_speed: INITIAL_BALL_SPEED,
            left_paddle_y: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2.0,
            right_paddle_y: (FIELD_HEIGHT - PADDLE_HEIGHT) / 2.0,
            left_paddle_input: 0.0,
            right_paddle_input: 0.0,
            left_score: 0,
            right_score: 0,
            waiting_for_serve: false,
            serving_side: -1,
        }
    }

    pub fn update(&mut self, dt: f64) {
        let left_paddle_vy = self.left_paddle_input * PADDLE_SPEED;
        let right_paddle_vy = self.right_paddle_input * PADDLE_SPEED;

        let old_left_paddle_y = self.left_paddle_y;
        let old_right_paddle_y = self.right_paddle_y;

        if !self.waiting_for_serve && !self.is_game_over() {
            self.left_paddle_y =
                (self.left_paddle_y + left_paddle_vy * dt).clamp(0.0, FIELD_HEIGHT - PADDLE_HEIGHT);
            self.right_paddle_y = (self.right_paddle_y + right_paddle_vy * dt)
                .clamp(0.0, FIELD_HEIGHT - PADDLE_HEIGHT);
        }

        // Skip ball physics if waiting for serve
        if self.waiting_for_serve {
            return;
        }

        let left_paddle_dy = self.left_paddle_y - old_left_paddle_y;
        let right_paddle_dy = self.right_paddle_y - old_right_paddle_y;

        let mut remaining_t = 1.0;
        let mut ball_dx = self.ball_vx * dt;
        let mut ball_dy = self.ball_vy * dt;

        for _ in 0..4 {
            if remaining_t <= 0.0 {
                break;
            }

            let ball = AABB::new(self.ball_x, self.ball_y, BALL_SIZE, BALL_SIZE);

            let top_wall = AABB::new(0.0, -100.0, FIELD_WIDTH, 100.0);
            let bottom_wall = AABB::new(0.0, FIELD_HEIGHT, FIELD_WIDTH, 100.0);

            let left_paddle = AABB::new(
                PADDLE_OFFSET,
                self.left_paddle_y,
                PADDLE_WIDTH,
                PADDLE_HEIGHT,
            );
            let right_paddle = AABB::new(
                FIELD_WIDTH - PADDLE_OFFSET - PADDLE_WIDTH,
                self.right_paddle_y,
                PADDLE_WIDTH,
                PADDLE_HEIGHT,
            );

            #[derive(Clone, Copy, PartialEq)]
            enum HitType {
                Wall,
                LeftPaddle,
                RightPaddle,
            }

            let mut earliest: Option<(SweptResult, HitType)> = None;

            if let Some(hit) = swept_aabb(ball, (ball_dx, ball_dy), top_wall) {
                earliest = Some((hit, HitType::Wall));
            }
            if let Some(hit) = swept_aabb(ball, (ball_dx, ball_dy), bottom_wall) {
                if earliest.is_none() || hit.t < earliest.unwrap().0.t {
                    earliest = Some((hit, HitType::Wall));
                }
            }

            let rel_left_vel = (ball_dx - 0.0, ball_dy - left_paddle_dy * remaining_t);
            if let Some(hit) = swept_aabb(ball, rel_left_vel, left_paddle) {
                if earliest.is_none() || hit.t < earliest.unwrap().0.t {
                    earliest = Some((hit, HitType::LeftPaddle));
                }
            }

            let rel_right_vel = (ball_dx - 0.0, ball_dy - right_paddle_dy * remaining_t);
            if let Some(hit) = swept_aabb(ball, rel_right_vel, right_paddle) {
                if earliest.is_none() || hit.t < earliest.unwrap().0.t {
                    earliest = Some((hit, HitType::RightPaddle));
                }
            }

            match earliest {
                Some((hit, hit_type)) => {
                    self.ball_x += ball_dx * hit.t;
                    self.ball_y += ball_dy * hit.t;

                    let remaining_dx = ball_dx * (1.0 - hit.t);
                    let remaining_dy = ball_dy * (1.0 - hit.t);

                    if hit.normal_x != 0.0 {
                        // Paddle hit - calculate new angle based on hit position
                        if hit_type == HitType::LeftPaddle || hit_type == HitType::RightPaddle {
                            let paddle_y = if hit_type == HitType::LeftPaddle {
                                self.left_paddle_y
                            } else {
                                self.right_paddle_y
                            };

                            // Calculate relative hit position (-1 to 1)
                            let ball_center_y = self.ball_y + BALL_SIZE / 2.0;
                            let paddle_center_y = paddle_y + PADDLE_HEIGHT / 2.0;
                            let relative_hit = ((ball_center_y - paddle_center_y)
                                / (PADDLE_HEIGHT / 2.0))
                                .clamp(-1.0, 1.0);

                            // Increase ball speed
                            self.ball_speed += BALL_SPEED_INCREMENT;

                            // Calculate new angle based on hit position
                            // Center hit (0) = horizontal, edge hit (±1) = ±60°
                            let bounce_angle = relative_hit * MAX_BOUNCE_ANGLE;

                            // Direction: left paddle sends ball right (+1), right paddle sends ball left (-1)
                            let direction = if hit_type == HitType::LeftPaddle {
                                1.0
                            } else {
                                -1.0
                            };

                            self.ball_vx = self.ball_speed * bounce_angle.cos() * direction;
                            self.ball_vy = self.ball_speed * bounce_angle.sin();

                            ball_dx = self.ball_vx * dt * (1.0 - hit.t);
                            ball_dy = self.ball_vy * dt * (1.0 - hit.t);
                        } else {
                            // Wall hit on X axis (shouldn't happen normally)
                            self.ball_vx = -self.ball_vx;
                            ball_dx = -remaining_dx;
                            ball_dy = remaining_dy;
                        }
                    } else {
                        // Top/bottom wall hit - simple reflection
                        self.ball_vy = -self.ball_vy;
                        ball_dx = remaining_dx;
                        ball_dy = -remaining_dy;
                    }

                    remaining_t *= 1.0 - hit.t;
                }
                None => {
                    self.ball_x += ball_dx;
                    self.ball_y += ball_dy;
                    break;
                }
            }
        }

        if self.ball_x + BALL_SIZE < 0.0 {
            self.right_score += 1;
            self.reset_ball(0); // Left player lost, they serve
        } else if self.ball_x > FIELD_WIDTH {
            self.left_score += 1;
            self.reset_ball(1); // Right player lost, they serve
        }
    }

    fn reset_ball(&mut self, loser_side: i32) {
        self.ball_x = FIELD_WIDTH / 2.0 - BALL_SIZE / 2.0;
        self.ball_y = FIELD_HEIGHT / 2.0 - BALL_SIZE / 2.0;
        self.ball_speed = INITIAL_BALL_SPEED;
        self.ball_vx = 0.0;
        self.ball_vy = 0.0;
        self.waiting_for_serve = true;
        self.serving_side = loser_side;

        // Reset paddles
        self.left_paddle_y = (FIELD_HEIGHT - PADDLE_HEIGHT) / 2.0;
        self.right_paddle_y = (FIELD_HEIGHT - PADDLE_HEIGHT) / 2.0;
    }

    /// Launch the ball - called by the serving player
    /// side: 0 = left, 1 = right
    /// Returns true if the serve was accepted
    pub fn launch_ball(&mut self, side: i32) -> bool {
        if !self.waiting_for_serve || self.serving_side != side {
            return false;
        }

        // Ball goes at 0 degrees (horizontal) towards the server (loser)
        // Left player (0) serves towards left (negative x), right player (1) serves towards right (positive x)
        let direction = if side == 0 { -1.0 } else { 1.0 };
        self.ball_vx = INITIAL_BALL_SPEED * direction;
        self.ball_vy = 0.0;
        self.waiting_for_serve = false;
        self.serving_side = -1;
        true
    }

    pub fn field_width(&self) -> f64 {
        FIELD_WIDTH
    }
    pub fn field_height(&self) -> f64 {
        FIELD_HEIGHT
    }
    pub fn paddle_width(&self) -> f64 {
        PADDLE_WIDTH
    }
    pub fn paddle_height(&self) -> f64 {
        PADDLE_HEIGHT
    }
    pub fn paddle_offset(&self) -> f64 {
        PADDLE_OFFSET
    }
    pub fn ball_size(&self) -> f64 {
        BALL_SIZE
    }

    pub fn is_game_over(&self) -> bool {
        self.left_score >= WINNING_SCORE || self.right_score >= WINNING_SCORE
    }

    /// Returns the winner: 0 = left, 1 = right, -1 = no winner yet
    pub fn winner(&self) -> i32 {
        if self.left_score >= WINNING_SCORE {
            0
        } else if self.right_score >= WINNING_SCORE {
            1
        } else {
            -1
        }
    }

    pub fn reset(&mut self) {
        *self = Game::new();
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_zero_dt() {
        let game1 = Game::new();
        let mut game2 = Game::new();
        game2.update(0.0);

        assert_eq!(game1.ball_x, game2.ball_x);
        assert_eq!(game1.ball_y, game2.ball_y);
    }
}
