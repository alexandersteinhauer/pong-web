## Functional Requirements

1. When user launches the app, the user can select local multiplayer mode or global multiplayer mode.
2. In local-multiplayer mode two user plays against each other on the local machine using W/S and ArrowUp/ArrowDown.
3. When selecting global multiplayer mode, the user can either create a room or a join a room.
4. When creating a room, the user is given a code he can share with his friends.
5. When joining a room, he needs to input a code that was previously created by someone else.
6. When a global multiplayer room is joined by two players, the game starts after 5 seconds.

## Non-functional Requirements

1. The client/server need to communicate using WebTransport.
2. Game state should be transported using datagrams, otherwise use reliable channels through WebTransport.
3. Use Protobuf to exchange binary messages.
4. The core game logic needs to written in Rust/WASM so the client and server have the exact same implementation of the game.4
5. The client needs to be written in SvelteKit with Svelte 5.

## Game Logic

1. The game finishes when one player reaches a score of 7.
2. The ball should begin with a speed of 400.
   2.1. After it's hit by a paddle, its speed should increase by 50. There's no cap to its speed.
3. The angle of the ball should be determined by where it hit the paddle. If the ball hit the paddle at the middle, it's output angle equals the input angle. When it's hit by the paddle edge, it's steered towards the wall. The max. output angle should be capped at +-60 degrees though.
4. When one player scores, the game should pause. The loser then launches the ball (using space or a touch tap) at a 0 degree angle towards himself.
