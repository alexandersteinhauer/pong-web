import * as $protobuf from "protobufjs";
import Long = require("long");
/** Namespace pong. */
export namespace pong {
  /** Properties of a ServerMessage. */
  interface IServerMessage {
    /** ServerMessage assignSide */
    assignSide?: pong.IAssignSide | null;

    /** ServerMessage roomCode */
    roomCode?: pong.IRoomCode | null;

    /** ServerMessage waiting */
    waiting?: pong.IWaiting | null;

    /** ServerMessage countdown */
    countdown?: pong.ICountdown | null;

    /** ServerMessage gameOver */
    gameOver?: pong.IGameOver | null;

    /** ServerMessage joinFailed */
    joinFailed?: pong.IJoinFailed | null;

    /** ServerMessage opponentLeft */
    opponentLeft?: pong.IOpponentLeft | null;
  }

  /** Represents a ServerMessage. */
  class ServerMessage implements IServerMessage {
    /**
     * Constructs a new ServerMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IServerMessage);

    /** ServerMessage assignSide. */
    public assignSide?: pong.IAssignSide | null;

    /** ServerMessage roomCode. */
    public roomCode?: pong.IRoomCode | null;

    /** ServerMessage waiting. */
    public waiting?: pong.IWaiting | null;

    /** ServerMessage countdown. */
    public countdown?: pong.ICountdown | null;

    /** ServerMessage gameOver. */
    public gameOver?: pong.IGameOver | null;

    /** ServerMessage joinFailed. */
    public joinFailed?: pong.IJoinFailed | null;

    /** ServerMessage opponentLeft. */
    public opponentLeft?: pong.IOpponentLeft | null;

    /** ServerMessage payload. */
    public payload?:
      | "assignSide"
      | "roomCode"
      | "waiting"
      | "countdown"
      | "gameOver"
      | "joinFailed"
      | "opponentLeft";

    /**
     * Creates a new ServerMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ServerMessage instance
     */
    public static create(properties?: pong.IServerMessage): pong.ServerMessage;

    /**
     * Encodes the specified ServerMessage message. Does not implicitly {@link pong.ServerMessage.verify|verify} messages.
     * @param message ServerMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IServerMessage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link pong.ServerMessage.verify|verify} messages.
     * @param message ServerMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IServerMessage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ServerMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ServerMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.ServerMessage;

    /**
     * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ServerMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.ServerMessage;

    /**
     * Verifies a ServerMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ServerMessage
     */
    public static fromObject(object: { [k: string]: any }): pong.ServerMessage;

    /**
     * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
     * @param message ServerMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.ServerMessage,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ServerMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ServerMessage
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Side enum. */
  enum Side {
    LEFT = 0,
    RIGHT = 1,
  }

  /** Properties of an AssignSide. */
  interface IAssignSide {
    /** AssignSide side */
    side?: pong.Side | null;
  }

  /** Represents an AssignSide. */
  class AssignSide implements IAssignSide {
    /**
     * Constructs a new AssignSide.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IAssignSide);

    /** AssignSide side. */
    public side: pong.Side;

    /**
     * Creates a new AssignSide instance using the specified properties.
     * @param [properties] Properties to set
     * @returns AssignSide instance
     */
    public static create(properties?: pong.IAssignSide): pong.AssignSide;

    /**
     * Encodes the specified AssignSide message. Does not implicitly {@link pong.AssignSide.verify|verify} messages.
     * @param message AssignSide message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IAssignSide,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified AssignSide message, length delimited. Does not implicitly {@link pong.AssignSide.verify|verify} messages.
     * @param message AssignSide message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IAssignSide,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an AssignSide message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns AssignSide
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.AssignSide;

    /**
     * Decodes an AssignSide message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns AssignSide
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.AssignSide;

    /**
     * Verifies an AssignSide message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an AssignSide message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns AssignSide
     */
    public static fromObject(object: { [k: string]: any }): pong.AssignSide;

    /**
     * Creates a plain object from an AssignSide message. Also converts values to other types if specified.
     * @param message AssignSide
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.AssignSide,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this AssignSide to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for AssignSide
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a RoomCode. */
  interface IRoomCode {
    /** RoomCode code */
    code?: string | null;
  }

  /** Represents a RoomCode. */
  class RoomCode implements IRoomCode {
    /**
     * Constructs a new RoomCode.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IRoomCode);

    /** RoomCode code. */
    public code: string;

    /**
     * Creates a new RoomCode instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RoomCode instance
     */
    public static create(properties?: pong.IRoomCode): pong.RoomCode;

    /**
     * Encodes the specified RoomCode message. Does not implicitly {@link pong.RoomCode.verify|verify} messages.
     * @param message RoomCode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IRoomCode,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified RoomCode message, length delimited. Does not implicitly {@link pong.RoomCode.verify|verify} messages.
     * @param message RoomCode message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IRoomCode,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a RoomCode message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RoomCode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.RoomCode;

    /**
     * Decodes a RoomCode message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RoomCode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.RoomCode;

    /**
     * Verifies a RoomCode message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a RoomCode message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RoomCode
     */
    public static fromObject(object: { [k: string]: any }): pong.RoomCode;

    /**
     * Creates a plain object from a RoomCode message. Also converts values to other types if specified.
     * @param message RoomCode
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.RoomCode,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this RoomCode to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RoomCode
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Waiting. */
  interface IWaiting {}

  /** Represents a Waiting. */
  class Waiting implements IWaiting {
    /**
     * Constructs a new Waiting.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IWaiting);

    /**
     * Creates a new Waiting instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Waiting instance
     */
    public static create(properties?: pong.IWaiting): pong.Waiting;

    /**
     * Encodes the specified Waiting message. Does not implicitly {@link pong.Waiting.verify|verify} messages.
     * @param message Waiting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IWaiting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Waiting message, length delimited. Does not implicitly {@link pong.Waiting.verify|verify} messages.
     * @param message Waiting message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IWaiting,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Waiting message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Waiting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.Waiting;

    /**
     * Decodes a Waiting message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Waiting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.Waiting;

    /**
     * Verifies a Waiting message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Waiting message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Waiting
     */
    public static fromObject(object: { [k: string]: any }): pong.Waiting;

    /**
     * Creates a plain object from a Waiting message. Also converts values to other types if specified.
     * @param message Waiting
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.Waiting,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Waiting to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Waiting
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a Countdown. */
  interface ICountdown {
    /** Countdown seconds */
    seconds?: number | null;
  }

  /** Represents a Countdown. */
  class Countdown implements ICountdown {
    /**
     * Constructs a new Countdown.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.ICountdown);

    /** Countdown seconds. */
    public seconds: number;

    /**
     * Creates a new Countdown instance using the specified properties.
     * @param [properties] Properties to set
     * @returns Countdown instance
     */
    public static create(properties?: pong.ICountdown): pong.Countdown;

    /**
     * Encodes the specified Countdown message. Does not implicitly {@link pong.Countdown.verify|verify} messages.
     * @param message Countdown message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.ICountdown,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified Countdown message, length delimited. Does not implicitly {@link pong.Countdown.verify|verify} messages.
     * @param message Countdown message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.ICountdown,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a Countdown message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns Countdown
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.Countdown;

    /**
     * Decodes a Countdown message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns Countdown
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.Countdown;

    /**
     * Verifies a Countdown message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a Countdown message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns Countdown
     */
    public static fromObject(object: { [k: string]: any }): pong.Countdown;

    /**
     * Creates a plain object from a Countdown message. Also converts values to other types if specified.
     * @param message Countdown
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.Countdown,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this Countdown to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for Countdown
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GameOver. */
  interface IGameOver {
    /** GameOver winner */
    winner?: pong.Side | null;
  }

  /** Represents a GameOver. */
  class GameOver implements IGameOver {
    /**
     * Constructs a new GameOver.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IGameOver);

    /** GameOver winner. */
    public winner: pong.Side;

    /**
     * Creates a new GameOver instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameOver instance
     */
    public static create(properties?: pong.IGameOver): pong.GameOver;

    /**
     * Encodes the specified GameOver message. Does not implicitly {@link pong.GameOver.verify|verify} messages.
     * @param message GameOver message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IGameOver,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified GameOver message, length delimited. Does not implicitly {@link pong.GameOver.verify|verify} messages.
     * @param message GameOver message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IGameOver,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a GameOver message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameOver
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.GameOver;

    /**
     * Decodes a GameOver message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameOver
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.GameOver;

    /**
     * Verifies a GameOver message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GameOver message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameOver
     */
    public static fromObject(object: { [k: string]: any }): pong.GameOver;

    /**
     * Creates a plain object from a GameOver message. Also converts values to other types if specified.
     * @param message GameOver
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.GameOver,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this GameOver to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GameOver
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a JoinFailed. */
  interface IJoinFailed {}

  /** Represents a JoinFailed. */
  class JoinFailed implements IJoinFailed {
    /**
     * Constructs a new JoinFailed.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IJoinFailed);

    /**
     * Creates a new JoinFailed instance using the specified properties.
     * @param [properties] Properties to set
     * @returns JoinFailed instance
     */
    public static create(properties?: pong.IJoinFailed): pong.JoinFailed;

    /**
     * Encodes the specified JoinFailed message. Does not implicitly {@link pong.JoinFailed.verify|verify} messages.
     * @param message JoinFailed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IJoinFailed,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified JoinFailed message, length delimited. Does not implicitly {@link pong.JoinFailed.verify|verify} messages.
     * @param message JoinFailed message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IJoinFailed,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a JoinFailed message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns JoinFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.JoinFailed;

    /**
     * Decodes a JoinFailed message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns JoinFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.JoinFailed;

    /**
     * Verifies a JoinFailed message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a JoinFailed message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns JoinFailed
     */
    public static fromObject(object: { [k: string]: any }): pong.JoinFailed;

    /**
     * Creates a plain object from a JoinFailed message. Also converts values to other types if specified.
     * @param message JoinFailed
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.JoinFailed,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this JoinFailed to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for JoinFailed
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of an OpponentLeft. */
  interface IOpponentLeft {}

  /** Represents an OpponentLeft. */
  class OpponentLeft implements IOpponentLeft {
    /**
     * Constructs a new OpponentLeft.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IOpponentLeft);

    /**
     * Creates a new OpponentLeft instance using the specified properties.
     * @param [properties] Properties to set
     * @returns OpponentLeft instance
     */
    public static create(properties?: pong.IOpponentLeft): pong.OpponentLeft;

    /**
     * Encodes the specified OpponentLeft message. Does not implicitly {@link pong.OpponentLeft.verify|verify} messages.
     * @param message OpponentLeft message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IOpponentLeft,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified OpponentLeft message, length delimited. Does not implicitly {@link pong.OpponentLeft.verify|verify} messages.
     * @param message OpponentLeft message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IOpponentLeft,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes an OpponentLeft message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns OpponentLeft
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.OpponentLeft;

    /**
     * Decodes an OpponentLeft message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns OpponentLeft
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.OpponentLeft;

    /**
     * Verifies an OpponentLeft message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates an OpponentLeft message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns OpponentLeft
     */
    public static fromObject(object: { [k: string]: any }): pong.OpponentLeft;

    /**
     * Creates a plain object from an OpponentLeft message. Also converts values to other types if specified.
     * @param message OpponentLeft
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.OpponentLeft,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this OpponentLeft to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for OpponentLeft
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a GameState. */
  interface IGameState {
    /** GameState ballX */
    ballX?: number | null;

    /** GameState ballY */
    ballY?: number | null;

    /** GameState leftPaddleY */
    leftPaddleY?: number | null;

    /** GameState rightPaddleY */
    rightPaddleY?: number | null;

    /** GameState leftScore */
    leftScore?: number | null;

    /** GameState rightScore */
    rightScore?: number | null;

    /** GameState waitingForServe */
    waitingForServe?: boolean | null;

    /** GameState servingSide */
    servingSide?: pong.Side | null;
  }

  /** Represents a GameState. */
  class GameState implements IGameState {
    /**
     * Constructs a new GameState.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IGameState);

    /** GameState ballX. */
    public ballX: number;

    /** GameState ballY. */
    public ballY: number;

    /** GameState leftPaddleY. */
    public leftPaddleY: number;

    /** GameState rightPaddleY. */
    public rightPaddleY: number;

    /** GameState leftScore. */
    public leftScore: number;

    /** GameState rightScore. */
    public rightScore: number;

    /** GameState waitingForServe. */
    public waitingForServe: boolean;

    /** GameState servingSide. */
    public servingSide: pong.Side;

    /**
     * Creates a new GameState instance using the specified properties.
     * @param [properties] Properties to set
     * @returns GameState instance
     */
    public static create(properties?: pong.IGameState): pong.GameState;

    /**
     * Encodes the specified GameState message. Does not implicitly {@link pong.GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IGameState,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link pong.GameState.verify|verify} messages.
     * @param message GameState message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IGameState,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.GameState;

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.GameState;

    /**
     * Verifies a GameState message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns GameState
     */
    public static fromObject(object: { [k: string]: any }): pong.GameState;

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @param message GameState
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.GameState,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this GameState to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for GameState
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a ClientMessage. */
  interface IClientMessage {
    /** ClientMessage rematchRequest */
    rematchRequest?: pong.IRematchRequest | null;
  }

  /** Represents a ClientMessage. */
  class ClientMessage implements IClientMessage {
    /**
     * Constructs a new ClientMessage.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IClientMessage);

    /** ClientMessage rematchRequest. */
    public rematchRequest?: pong.IRematchRequest | null;

    /** ClientMessage payload. */
    public payload?: "rematchRequest";

    /**
     * Creates a new ClientMessage instance using the specified properties.
     * @param [properties] Properties to set
     * @returns ClientMessage instance
     */
    public static create(properties?: pong.IClientMessage): pong.ClientMessage;

    /**
     * Encodes the specified ClientMessage message. Does not implicitly {@link pong.ClientMessage.verify|verify} messages.
     * @param message ClientMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IClientMessage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link pong.ClientMessage.verify|verify} messages.
     * @param message ClientMessage message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IClientMessage,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a ClientMessage message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns ClientMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.ClientMessage;

    /**
     * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns ClientMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.ClientMessage;

    /**
     * Verifies a ClientMessage message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns ClientMessage
     */
    public static fromObject(object: { [k: string]: any }): pong.ClientMessage;

    /**
     * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
     * @param message ClientMessage
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.ClientMessage,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this ClientMessage to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for ClientMessage
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a RematchRequest. */
  interface IRematchRequest {}

  /** Represents a RematchRequest. */
  class RematchRequest implements IRematchRequest {
    /**
     * Constructs a new RematchRequest.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IRematchRequest);

    /**
     * Creates a new RematchRequest instance using the specified properties.
     * @param [properties] Properties to set
     * @returns RematchRequest instance
     */
    public static create(
      properties?: pong.IRematchRequest,
    ): pong.RematchRequest;

    /**
     * Encodes the specified RematchRequest message. Does not implicitly {@link pong.RematchRequest.verify|verify} messages.
     * @param message RematchRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IRematchRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified RematchRequest message, length delimited. Does not implicitly {@link pong.RematchRequest.verify|verify} messages.
     * @param message RematchRequest message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IRematchRequest,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a RematchRequest message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns RematchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.RematchRequest;

    /**
     * Decodes a RematchRequest message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns RematchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.RematchRequest;

    /**
     * Verifies a RematchRequest message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a RematchRequest message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns RematchRequest
     */
    public static fromObject(object: { [k: string]: any }): pong.RematchRequest;

    /**
     * Creates a plain object from a RematchRequest message. Also converts values to other types if specified.
     * @param message RematchRequest
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.RematchRequest,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this RematchRequest to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for RematchRequest
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }

  /** Properties of a PlayerInput. */
  interface IPlayerInput {
    /** PlayerInput direction */
    direction?: number | null;
  }

  /** Represents a PlayerInput. */
  class PlayerInput implements IPlayerInput {
    /**
     * Constructs a new PlayerInput.
     * @param [properties] Properties to set
     */
    constructor(properties?: pong.IPlayerInput);

    /** PlayerInput direction. */
    public direction: number;

    /**
     * Creates a new PlayerInput instance using the specified properties.
     * @param [properties] Properties to set
     * @returns PlayerInput instance
     */
    public static create(properties?: pong.IPlayerInput): pong.PlayerInput;

    /**
     * Encodes the specified PlayerInput message. Does not implicitly {@link pong.PlayerInput.verify|verify} messages.
     * @param message PlayerInput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encode(
      message: pong.IPlayerInput,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link pong.PlayerInput.verify|verify} messages.
     * @param message PlayerInput message or plain object to encode
     * @param [writer] Writer to encode to
     * @returns Writer
     */
    public static encodeDelimited(
      message: pong.IPlayerInput,
      writer?: $protobuf.Writer,
    ): $protobuf.Writer;

    /**
     * Decodes a PlayerInput message from the specified reader or buffer.
     * @param reader Reader or buffer to decode from
     * @param [length] Message length if known beforehand
     * @returns PlayerInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decode(
      reader: $protobuf.Reader | Uint8Array,
      length?: number,
    ): pong.PlayerInput;

    /**
     * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
     * @param reader Reader or buffer to decode from
     * @returns PlayerInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    public static decodeDelimited(
      reader: $protobuf.Reader | Uint8Array,
    ): pong.PlayerInput;

    /**
     * Verifies a PlayerInput message.
     * @param message Plain object to verify
     * @returns `null` if valid, otherwise the reason why it is not
     */
    public static verify(message: { [k: string]: any }): string | null;

    /**
     * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
     * @param object Plain object
     * @returns PlayerInput
     */
    public static fromObject(object: { [k: string]: any }): pong.PlayerInput;

    /**
     * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
     * @param message PlayerInput
     * @param [options] Conversion options
     * @returns Plain object
     */
    public static toObject(
      message: pong.PlayerInput,
      options?: $protobuf.IConversionOptions,
    ): { [k: string]: any };

    /**
     * Converts this PlayerInput to JSON.
     * @returns JSON object
     */
    public toJSON(): { [k: string]: any };

    /**
     * Gets the default type url for PlayerInput
     * @param [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns The default type url
     */
    public static getTypeUrl(typeUrlPrefix?: string): string;
  }
}
