## Functional Requirements

1. When user launches the app, the user can select local multiplayer mode or global multiplayer mode.
2. In local-multiplayer mode two user plays against each other on the local machine using W/S and ArrowUp/ArrowDown.
3. When selecting global multiplayer mode, the user can either create a room or a join a room.
4. When creating a room, the user is given a code he can share with his friends.
5. When joining a room, he needs to input a code that was previously created by someone else.
6. When a global multiplayer room is joined by two players, the game starts after 5 seconds.
7. A pong game finishes when one player reaches a score of 7.

## Non-functional Requirements

1. The client/server need to communicate using WebTransport.
2. The core game logic needs to written in Rust/WASM so the client and server have the exact same implementation of the game.
3. The client needs to be written in SvelteKit with Svelte 5.
