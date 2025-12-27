/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
import * as $protobuf from "protobufjs/minimal";

// Common aliases
const $Reader = $protobuf.Reader,
  $Writer = $protobuf.Writer,
  $util = $protobuf.util;

// Exported root namespace
const $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

export const pong = ($root.pong = (() => {
  /**
   * Namespace pong.
   * @exports pong
   * @namespace
   */
  const pong = {};

  pong.ServerMessage = (function () {
    /**
     * Properties of a ServerMessage.
     * @memberof pong
     * @interface IServerMessage
     * @property {pong.IAssignSide|null} [assignSide] ServerMessage assignSide
     * @property {pong.IRoomCode|null} [roomCode] ServerMessage roomCode
     * @property {pong.IWaiting|null} [waiting] ServerMessage waiting
     * @property {pong.ICountdown|null} [countdown] ServerMessage countdown
     * @property {pong.IGameOver|null} [gameOver] ServerMessage gameOver
     * @property {pong.IJoinFailed|null} [joinFailed] ServerMessage joinFailed
     * @property {pong.IOpponentLeft|null} [opponentLeft] ServerMessage opponentLeft
     */

    /**
     * Constructs a new ServerMessage.
     * @memberof pong
     * @classdesc Represents a ServerMessage.
     * @implements IServerMessage
     * @constructor
     * @param {pong.IServerMessage=} [properties] Properties to set
     */
    function ServerMessage(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * ServerMessage assignSide.
     * @member {pong.IAssignSide|null|undefined} assignSide
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.assignSide = null;

    /**
     * ServerMessage roomCode.
     * @member {pong.IRoomCode|null|undefined} roomCode
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.roomCode = null;

    /**
     * ServerMessage waiting.
     * @member {pong.IWaiting|null|undefined} waiting
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.waiting = null;

    /**
     * ServerMessage countdown.
     * @member {pong.ICountdown|null|undefined} countdown
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.countdown = null;

    /**
     * ServerMessage gameOver.
     * @member {pong.IGameOver|null|undefined} gameOver
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.gameOver = null;

    /**
     * ServerMessage joinFailed.
     * @member {pong.IJoinFailed|null|undefined} joinFailed
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.joinFailed = null;

    /**
     * ServerMessage opponentLeft.
     * @member {pong.IOpponentLeft|null|undefined} opponentLeft
     * @memberof pong.ServerMessage
     * @instance
     */
    ServerMessage.prototype.opponentLeft = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * ServerMessage payload.
     * @member {"assignSide"|"roomCode"|"waiting"|"countdown"|"gameOver"|"joinFailed"|"opponentLeft"|undefined} payload
     * @memberof pong.ServerMessage
     * @instance
     */
    Object.defineProperty(ServerMessage.prototype, "payload", {
      get: $util.oneOfGetter(
        ($oneOfFields = [
          "assignSide",
          "roomCode",
          "waiting",
          "countdown",
          "gameOver",
          "joinFailed",
          "opponentLeft",
        ]),
      ),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new ServerMessage instance using the specified properties.
     * @function create
     * @memberof pong.ServerMessage
     * @static
     * @param {pong.IServerMessage=} [properties] Properties to set
     * @returns {pong.ServerMessage} ServerMessage instance
     */
    ServerMessage.create = function create(properties) {
      return new ServerMessage(properties);
    };

    /**
     * Encodes the specified ServerMessage message. Does not implicitly {@link pong.ServerMessage.verify|verify} messages.
     * @function encode
     * @memberof pong.ServerMessage
     * @static
     * @param {pong.IServerMessage} message ServerMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerMessage.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.assignSide != null &&
        Object.hasOwnProperty.call(message, "assignSide")
      )
        $root.pong.AssignSide.encode(
          message.assignSide,
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
        ).ldelim();
      if (
        message.roomCode != null &&
        Object.hasOwnProperty.call(message, "roomCode")
      )
        $root.pong.RoomCode.encode(
          message.roomCode,
          writer.uint32(/* id 2, wireType 2 =*/ 18).fork(),
        ).ldelim();
      if (
        message.waiting != null &&
        Object.hasOwnProperty.call(message, "waiting")
      )
        $root.pong.Waiting.encode(
          message.waiting,
          writer.uint32(/* id 3, wireType 2 =*/ 26).fork(),
        ).ldelim();
      if (
        message.countdown != null &&
        Object.hasOwnProperty.call(message, "countdown")
      )
        $root.pong.Countdown.encode(
          message.countdown,
          writer.uint32(/* id 4, wireType 2 =*/ 34).fork(),
        ).ldelim();
      if (
        message.gameOver != null &&
        Object.hasOwnProperty.call(message, "gameOver")
      )
        $root.pong.GameOver.encode(
          message.gameOver,
          writer.uint32(/* id 5, wireType 2 =*/ 42).fork(),
        ).ldelim();
      if (
        message.joinFailed != null &&
        Object.hasOwnProperty.call(message, "joinFailed")
      )
        $root.pong.JoinFailed.encode(
          message.joinFailed,
          writer.uint32(/* id 6, wireType 2 =*/ 50).fork(),
        ).ldelim();
      if (
        message.opponentLeft != null &&
        Object.hasOwnProperty.call(message, "opponentLeft")
      )
        $root.pong.OpponentLeft.encode(
          message.opponentLeft,
          writer.uint32(/* id 7, wireType 2 =*/ 58).fork(),
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified ServerMessage message, length delimited. Does not implicitly {@link pong.ServerMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.ServerMessage
     * @static
     * @param {pong.IServerMessage} message ServerMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ServerMessage.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ServerMessage message from the specified reader or buffer.
     * @function decode
     * @memberof pong.ServerMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.ServerMessage} ServerMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerMessage.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.ServerMessage();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.assignSide = $root.pong.AssignSide.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 2: {
            message.roomCode = $root.pong.RoomCode.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 3: {
            message.waiting = $root.pong.Waiting.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 4: {
            message.countdown = $root.pong.Countdown.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 5: {
            message.gameOver = $root.pong.GameOver.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 6: {
            message.joinFailed = $root.pong.JoinFailed.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          case 7: {
            message.opponentLeft = $root.pong.OpponentLeft.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a ServerMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.ServerMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.ServerMessage} ServerMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ServerMessage.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ServerMessage message.
     * @function verify
     * @memberof pong.ServerMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ServerMessage.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      let properties = {};
      if (message.assignSide != null && message.hasOwnProperty("assignSide")) {
        properties.payload = 1;
        {
          let error = $root.pong.AssignSide.verify(message.assignSide);
          if (error) return "assignSide." + error;
        }
      }
      if (message.roomCode != null && message.hasOwnProperty("roomCode")) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.RoomCode.verify(message.roomCode);
          if (error) return "roomCode." + error;
        }
      }
      if (message.waiting != null && message.hasOwnProperty("waiting")) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.Waiting.verify(message.waiting);
          if (error) return "waiting." + error;
        }
      }
      if (message.countdown != null && message.hasOwnProperty("countdown")) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.Countdown.verify(message.countdown);
          if (error) return "countdown." + error;
        }
      }
      if (message.gameOver != null && message.hasOwnProperty("gameOver")) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.GameOver.verify(message.gameOver);
          if (error) return "gameOver." + error;
        }
      }
      if (message.joinFailed != null && message.hasOwnProperty("joinFailed")) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.JoinFailed.verify(message.joinFailed);
          if (error) return "joinFailed." + error;
        }
      }
      if (
        message.opponentLeft != null &&
        message.hasOwnProperty("opponentLeft")
      ) {
        if (properties.payload === 1) return "payload: multiple values";
        properties.payload = 1;
        {
          let error = $root.pong.OpponentLeft.verify(message.opponentLeft);
          if (error) return "opponentLeft." + error;
        }
      }
      return null;
    };

    /**
     * Creates a ServerMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.ServerMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.ServerMessage} ServerMessage
     */
    ServerMessage.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.ServerMessage) return object;
      let message = new $root.pong.ServerMessage();
      if (object.assignSide != null) {
        if (typeof object.assignSide !== "object")
          throw TypeError(".pong.ServerMessage.assignSide: object expected");
        message.assignSide = $root.pong.AssignSide.fromObject(
          object.assignSide,
        );
      }
      if (object.roomCode != null) {
        if (typeof object.roomCode !== "object")
          throw TypeError(".pong.ServerMessage.roomCode: object expected");
        message.roomCode = $root.pong.RoomCode.fromObject(object.roomCode);
      }
      if (object.waiting != null) {
        if (typeof object.waiting !== "object")
          throw TypeError(".pong.ServerMessage.waiting: object expected");
        message.waiting = $root.pong.Waiting.fromObject(object.waiting);
      }
      if (object.countdown != null) {
        if (typeof object.countdown !== "object")
          throw TypeError(".pong.ServerMessage.countdown: object expected");
        message.countdown = $root.pong.Countdown.fromObject(object.countdown);
      }
      if (object.gameOver != null) {
        if (typeof object.gameOver !== "object")
          throw TypeError(".pong.ServerMessage.gameOver: object expected");
        message.gameOver = $root.pong.GameOver.fromObject(object.gameOver);
      }
      if (object.joinFailed != null) {
        if (typeof object.joinFailed !== "object")
          throw TypeError(".pong.ServerMessage.joinFailed: object expected");
        message.joinFailed = $root.pong.JoinFailed.fromObject(
          object.joinFailed,
        );
      }
      if (object.opponentLeft != null) {
        if (typeof object.opponentLeft !== "object")
          throw TypeError(".pong.ServerMessage.opponentLeft: object expected");
        message.opponentLeft = $root.pong.OpponentLeft.fromObject(
          object.opponentLeft,
        );
      }
      return message;
    };

    /**
     * Creates a plain object from a ServerMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.ServerMessage
     * @static
     * @param {pong.ServerMessage} message ServerMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ServerMessage.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (message.assignSide != null && message.hasOwnProperty("assignSide")) {
        object.assignSide = $root.pong.AssignSide.toObject(
          message.assignSide,
          options,
        );
        if (options.oneofs) object.payload = "assignSide";
      }
      if (message.roomCode != null && message.hasOwnProperty("roomCode")) {
        object.roomCode = $root.pong.RoomCode.toObject(
          message.roomCode,
          options,
        );
        if (options.oneofs) object.payload = "roomCode";
      }
      if (message.waiting != null && message.hasOwnProperty("waiting")) {
        object.waiting = $root.pong.Waiting.toObject(message.waiting, options);
        if (options.oneofs) object.payload = "waiting";
      }
      if (message.countdown != null && message.hasOwnProperty("countdown")) {
        object.countdown = $root.pong.Countdown.toObject(
          message.countdown,
          options,
        );
        if (options.oneofs) object.payload = "countdown";
      }
      if (message.gameOver != null && message.hasOwnProperty("gameOver")) {
        object.gameOver = $root.pong.GameOver.toObject(
          message.gameOver,
          options,
        );
        if (options.oneofs) object.payload = "gameOver";
      }
      if (message.joinFailed != null && message.hasOwnProperty("joinFailed")) {
        object.joinFailed = $root.pong.JoinFailed.toObject(
          message.joinFailed,
          options,
        );
        if (options.oneofs) object.payload = "joinFailed";
      }
      if (
        message.opponentLeft != null &&
        message.hasOwnProperty("opponentLeft")
      ) {
        object.opponentLeft = $root.pong.OpponentLeft.toObject(
          message.opponentLeft,
          options,
        );
        if (options.oneofs) object.payload = "opponentLeft";
      }
      return object;
    };

    /**
     * Converts this ServerMessage to JSON.
     * @function toJSON
     * @memberof pong.ServerMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ServerMessage.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ServerMessage
     * @function getTypeUrl
     * @memberof pong.ServerMessage
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ServerMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.ServerMessage";
    };

    return ServerMessage;
  })();

  /**
   * Side enum.
   * @name pong.Side
   * @enum {number}
   * @property {number} LEFT=0 LEFT value
   * @property {number} RIGHT=1 RIGHT value
   */
  pong.Side = (function () {
    const valuesById = {},
      values = Object.create(valuesById);
    values[(valuesById[0] = "LEFT")] = 0;
    values[(valuesById[1] = "RIGHT")] = 1;
    return values;
  })();

  pong.AssignSide = (function () {
    /**
     * Properties of an AssignSide.
     * @memberof pong
     * @interface IAssignSide
     * @property {pong.Side|null} [side] AssignSide side
     */

    /**
     * Constructs a new AssignSide.
     * @memberof pong
     * @classdesc Represents an AssignSide.
     * @implements IAssignSide
     * @constructor
     * @param {pong.IAssignSide=} [properties] Properties to set
     */
    function AssignSide(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * AssignSide side.
     * @member {pong.Side} side
     * @memberof pong.AssignSide
     * @instance
     */
    AssignSide.prototype.side = 0;

    /**
     * Creates a new AssignSide instance using the specified properties.
     * @function create
     * @memberof pong.AssignSide
     * @static
     * @param {pong.IAssignSide=} [properties] Properties to set
     * @returns {pong.AssignSide} AssignSide instance
     */
    AssignSide.create = function create(properties) {
      return new AssignSide(properties);
    };

    /**
     * Encodes the specified AssignSide message. Does not implicitly {@link pong.AssignSide.verify|verify} messages.
     * @function encode
     * @memberof pong.AssignSide
     * @static
     * @param {pong.IAssignSide} message AssignSide message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssignSide.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.side != null && Object.hasOwnProperty.call(message, "side"))
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.side);
      return writer;
    };

    /**
     * Encodes the specified AssignSide message, length delimited. Does not implicitly {@link pong.AssignSide.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.AssignSide
     * @static
     * @param {pong.IAssignSide} message AssignSide message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    AssignSide.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an AssignSide message from the specified reader or buffer.
     * @function decode
     * @memberof pong.AssignSide
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.AssignSide} AssignSide
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssignSide.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.AssignSide();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.side = reader.int32();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an AssignSide message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.AssignSide
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.AssignSide} AssignSide
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    AssignSide.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an AssignSide message.
     * @function verify
     * @memberof pong.AssignSide
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    AssignSide.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.side != null && message.hasOwnProperty("side"))
        switch (message.side) {
          default:
            return "side: enum value expected";
          case 0:
          case 1:
            break;
        }
      return null;
    };

    /**
     * Creates an AssignSide message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.AssignSide
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.AssignSide} AssignSide
     */
    AssignSide.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.AssignSide) return object;
      let message = new $root.pong.AssignSide();
      switch (object.side) {
        default:
          if (typeof object.side === "number") {
            message.side = object.side;
            break;
          }
          break;
        case "LEFT":
        case 0:
          message.side = 0;
          break;
        case "RIGHT":
        case 1:
          message.side = 1;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from an AssignSide message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.AssignSide
     * @static
     * @param {pong.AssignSide} message AssignSide
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    AssignSide.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) object.side = options.enums === String ? "LEFT" : 0;
      if (message.side != null && message.hasOwnProperty("side"))
        object.side =
          options.enums === String
            ? $root.pong.Side[message.side] === undefined
              ? message.side
              : $root.pong.Side[message.side]
            : message.side;
      return object;
    };

    /**
     * Converts this AssignSide to JSON.
     * @function toJSON
     * @memberof pong.AssignSide
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    AssignSide.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for AssignSide
     * @function getTypeUrl
     * @memberof pong.AssignSide
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    AssignSide.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.AssignSide";
    };

    return AssignSide;
  })();

  pong.RoomCode = (function () {
    /**
     * Properties of a RoomCode.
     * @memberof pong
     * @interface IRoomCode
     * @property {string|null} [code] RoomCode code
     */

    /**
     * Constructs a new RoomCode.
     * @memberof pong
     * @classdesc Represents a RoomCode.
     * @implements IRoomCode
     * @constructor
     * @param {pong.IRoomCode=} [properties] Properties to set
     */
    function RoomCode(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * RoomCode code.
     * @member {string} code
     * @memberof pong.RoomCode
     * @instance
     */
    RoomCode.prototype.code = "";

    /**
     * Creates a new RoomCode instance using the specified properties.
     * @function create
     * @memberof pong.RoomCode
     * @static
     * @param {pong.IRoomCode=} [properties] Properties to set
     * @returns {pong.RoomCode} RoomCode instance
     */
    RoomCode.create = function create(properties) {
      return new RoomCode(properties);
    };

    /**
     * Encodes the specified RoomCode message. Does not implicitly {@link pong.RoomCode.verify|verify} messages.
     * @function encode
     * @memberof pong.RoomCode
     * @static
     * @param {pong.IRoomCode} message RoomCode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomCode.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.code != null && Object.hasOwnProperty.call(message, "code"))
        writer.uint32(/* id 1, wireType 2 =*/ 10).string(message.code);
      return writer;
    };

    /**
     * Encodes the specified RoomCode message, length delimited. Does not implicitly {@link pong.RoomCode.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.RoomCode
     * @static
     * @param {pong.IRoomCode} message RoomCode message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RoomCode.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RoomCode message from the specified reader or buffer.
     * @function decode
     * @memberof pong.RoomCode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.RoomCode} RoomCode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomCode.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.RoomCode();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.code = reader.string();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a RoomCode message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.RoomCode
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.RoomCode} RoomCode
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RoomCode.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RoomCode message.
     * @function verify
     * @memberof pong.RoomCode
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RoomCode.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.code != null && message.hasOwnProperty("code"))
        if (!$util.isString(message.code)) return "code: string expected";
      return null;
    };

    /**
     * Creates a RoomCode message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.RoomCode
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.RoomCode} RoomCode
     */
    RoomCode.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.RoomCode) return object;
      let message = new $root.pong.RoomCode();
      if (object.code != null) message.code = String(object.code);
      return message;
    };

    /**
     * Creates a plain object from a RoomCode message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.RoomCode
     * @static
     * @param {pong.RoomCode} message RoomCode
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RoomCode.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) object.code = "";
      if (message.code != null && message.hasOwnProperty("code"))
        object.code = message.code;
      return object;
    };

    /**
     * Converts this RoomCode to JSON.
     * @function toJSON
     * @memberof pong.RoomCode
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RoomCode.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RoomCode
     * @function getTypeUrl
     * @memberof pong.RoomCode
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RoomCode.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.RoomCode";
    };

    return RoomCode;
  })();

  pong.Waiting = (function () {
    /**
     * Properties of a Waiting.
     * @memberof pong
     * @interface IWaiting
     */

    /**
     * Constructs a new Waiting.
     * @memberof pong
     * @classdesc Represents a Waiting.
     * @implements IWaiting
     * @constructor
     * @param {pong.IWaiting=} [properties] Properties to set
     */
    function Waiting(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new Waiting instance using the specified properties.
     * @function create
     * @memberof pong.Waiting
     * @static
     * @param {pong.IWaiting=} [properties] Properties to set
     * @returns {pong.Waiting} Waiting instance
     */
    Waiting.create = function create(properties) {
      return new Waiting(properties);
    };

    /**
     * Encodes the specified Waiting message. Does not implicitly {@link pong.Waiting.verify|verify} messages.
     * @function encode
     * @memberof pong.Waiting
     * @static
     * @param {pong.IWaiting} message Waiting message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Waiting.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      return writer;
    };

    /**
     * Encodes the specified Waiting message, length delimited. Does not implicitly {@link pong.Waiting.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.Waiting
     * @static
     * @param {pong.IWaiting} message Waiting message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Waiting.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Waiting message from the specified reader or buffer.
     * @function decode
     * @memberof pong.Waiting
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.Waiting} Waiting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Waiting.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.Waiting();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a Waiting message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.Waiting
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.Waiting} Waiting
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Waiting.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Waiting message.
     * @function verify
     * @memberof pong.Waiting
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Waiting.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      return null;
    };

    /**
     * Creates a Waiting message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.Waiting
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.Waiting} Waiting
     */
    Waiting.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.Waiting) return object;
      return new $root.pong.Waiting();
    };

    /**
     * Creates a plain object from a Waiting message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.Waiting
     * @static
     * @param {pong.Waiting} message Waiting
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Waiting.toObject = function toObject() {
      return {};
    };

    /**
     * Converts this Waiting to JSON.
     * @function toJSON
     * @memberof pong.Waiting
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Waiting.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Waiting
     * @function getTypeUrl
     * @memberof pong.Waiting
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Waiting.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.Waiting";
    };

    return Waiting;
  })();

  pong.Countdown = (function () {
    /**
     * Properties of a Countdown.
     * @memberof pong
     * @interface ICountdown
     * @property {number|null} [seconds] Countdown seconds
     */

    /**
     * Constructs a new Countdown.
     * @memberof pong
     * @classdesc Represents a Countdown.
     * @implements ICountdown
     * @constructor
     * @param {pong.ICountdown=} [properties] Properties to set
     */
    function Countdown(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * Countdown seconds.
     * @member {number} seconds
     * @memberof pong.Countdown
     * @instance
     */
    Countdown.prototype.seconds = 0;

    /**
     * Creates a new Countdown instance using the specified properties.
     * @function create
     * @memberof pong.Countdown
     * @static
     * @param {pong.ICountdown=} [properties] Properties to set
     * @returns {pong.Countdown} Countdown instance
     */
    Countdown.create = function create(properties) {
      return new Countdown(properties);
    };

    /**
     * Encodes the specified Countdown message. Does not implicitly {@link pong.Countdown.verify|verify} messages.
     * @function encode
     * @memberof pong.Countdown
     * @static
     * @param {pong.ICountdown} message Countdown message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Countdown.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.seconds != null &&
        Object.hasOwnProperty.call(message, "seconds")
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).uint32(message.seconds);
      return writer;
    };

    /**
     * Encodes the specified Countdown message, length delimited. Does not implicitly {@link pong.Countdown.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.Countdown
     * @static
     * @param {pong.ICountdown} message Countdown message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    Countdown.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a Countdown message from the specified reader or buffer.
     * @function decode
     * @memberof pong.Countdown
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.Countdown} Countdown
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Countdown.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.Countdown();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.seconds = reader.uint32();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a Countdown message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.Countdown
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.Countdown} Countdown
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    Countdown.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a Countdown message.
     * @function verify
     * @memberof pong.Countdown
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    Countdown.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.seconds != null && message.hasOwnProperty("seconds"))
        if (!$util.isInteger(message.seconds))
          return "seconds: integer expected";
      return null;
    };

    /**
     * Creates a Countdown message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.Countdown
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.Countdown} Countdown
     */
    Countdown.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.Countdown) return object;
      let message = new $root.pong.Countdown();
      if (object.seconds != null) message.seconds = object.seconds >>> 0;
      return message;
    };

    /**
     * Creates a plain object from a Countdown message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.Countdown
     * @static
     * @param {pong.Countdown} message Countdown
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    Countdown.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) object.seconds = 0;
      if (message.seconds != null && message.hasOwnProperty("seconds"))
        object.seconds = message.seconds;
      return object;
    };

    /**
     * Converts this Countdown to JSON.
     * @function toJSON
     * @memberof pong.Countdown
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    Countdown.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for Countdown
     * @function getTypeUrl
     * @memberof pong.Countdown
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    Countdown.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.Countdown";
    };

    return Countdown;
  })();

  pong.GameOver = (function () {
    /**
     * Properties of a GameOver.
     * @memberof pong
     * @interface IGameOver
     * @property {pong.Side|null} [winner] GameOver winner
     */

    /**
     * Constructs a new GameOver.
     * @memberof pong
     * @classdesc Represents a GameOver.
     * @implements IGameOver
     * @constructor
     * @param {pong.IGameOver=} [properties] Properties to set
     */
    function GameOver(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameOver winner.
     * @member {pong.Side} winner
     * @memberof pong.GameOver
     * @instance
     */
    GameOver.prototype.winner = 0;

    /**
     * Creates a new GameOver instance using the specified properties.
     * @function create
     * @memberof pong.GameOver
     * @static
     * @param {pong.IGameOver=} [properties] Properties to set
     * @returns {pong.GameOver} GameOver instance
     */
    GameOver.create = function create(properties) {
      return new GameOver(properties);
    };

    /**
     * Encodes the specified GameOver message. Does not implicitly {@link pong.GameOver.verify|verify} messages.
     * @function encode
     * @memberof pong.GameOver
     * @static
     * @param {pong.IGameOver} message GameOver message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameOver.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.winner != null &&
        Object.hasOwnProperty.call(message, "winner")
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).int32(message.winner);
      return writer;
    };

    /**
     * Encodes the specified GameOver message, length delimited. Does not implicitly {@link pong.GameOver.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.GameOver
     * @static
     * @param {pong.IGameOver} message GameOver message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameOver.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameOver message from the specified reader or buffer.
     * @function decode
     * @memberof pong.GameOver
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.GameOver} GameOver
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameOver.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.GameOver();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.winner = reader.int32();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a GameOver message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.GameOver
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.GameOver} GameOver
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameOver.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameOver message.
     * @function verify
     * @memberof pong.GameOver
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameOver.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.winner != null && message.hasOwnProperty("winner"))
        switch (message.winner) {
          default:
            return "winner: enum value expected";
          case 0:
          case 1:
            break;
        }
      return null;
    };

    /**
     * Creates a GameOver message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.GameOver
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.GameOver} GameOver
     */
    GameOver.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.GameOver) return object;
      let message = new $root.pong.GameOver();
      switch (object.winner) {
        default:
          if (typeof object.winner === "number") {
            message.winner = object.winner;
            break;
          }
          break;
        case "LEFT":
        case 0:
          message.winner = 0;
          break;
        case "RIGHT":
        case 1:
          message.winner = 1;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from a GameOver message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.GameOver
     * @static
     * @param {pong.GameOver} message GameOver
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameOver.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults)
        object.winner = options.enums === String ? "LEFT" : 0;
      if (message.winner != null && message.hasOwnProperty("winner"))
        object.winner =
          options.enums === String
            ? $root.pong.Side[message.winner] === undefined
              ? message.winner
              : $root.pong.Side[message.winner]
            : message.winner;
      return object;
    };

    /**
     * Converts this GameOver to JSON.
     * @function toJSON
     * @memberof pong.GameOver
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameOver.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for GameOver
     * @function getTypeUrl
     * @memberof pong.GameOver
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    GameOver.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.GameOver";
    };

    return GameOver;
  })();

  pong.JoinFailed = (function () {
    /**
     * Properties of a JoinFailed.
     * @memberof pong
     * @interface IJoinFailed
     */

    /**
     * Constructs a new JoinFailed.
     * @memberof pong
     * @classdesc Represents a JoinFailed.
     * @implements IJoinFailed
     * @constructor
     * @param {pong.IJoinFailed=} [properties] Properties to set
     */
    function JoinFailed(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new JoinFailed instance using the specified properties.
     * @function create
     * @memberof pong.JoinFailed
     * @static
     * @param {pong.IJoinFailed=} [properties] Properties to set
     * @returns {pong.JoinFailed} JoinFailed instance
     */
    JoinFailed.create = function create(properties) {
      return new JoinFailed(properties);
    };

    /**
     * Encodes the specified JoinFailed message. Does not implicitly {@link pong.JoinFailed.verify|verify} messages.
     * @function encode
     * @memberof pong.JoinFailed
     * @static
     * @param {pong.IJoinFailed} message JoinFailed message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    JoinFailed.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      return writer;
    };

    /**
     * Encodes the specified JoinFailed message, length delimited. Does not implicitly {@link pong.JoinFailed.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.JoinFailed
     * @static
     * @param {pong.IJoinFailed} message JoinFailed message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    JoinFailed.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a JoinFailed message from the specified reader or buffer.
     * @function decode
     * @memberof pong.JoinFailed
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.JoinFailed} JoinFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    JoinFailed.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.JoinFailed();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a JoinFailed message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.JoinFailed
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.JoinFailed} JoinFailed
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    JoinFailed.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a JoinFailed message.
     * @function verify
     * @memberof pong.JoinFailed
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    JoinFailed.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      return null;
    };

    /**
     * Creates a JoinFailed message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.JoinFailed
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.JoinFailed} JoinFailed
     */
    JoinFailed.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.JoinFailed) return object;
      return new $root.pong.JoinFailed();
    };

    /**
     * Creates a plain object from a JoinFailed message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.JoinFailed
     * @static
     * @param {pong.JoinFailed} message JoinFailed
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    JoinFailed.toObject = function toObject() {
      return {};
    };

    /**
     * Converts this JoinFailed to JSON.
     * @function toJSON
     * @memberof pong.JoinFailed
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    JoinFailed.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for JoinFailed
     * @function getTypeUrl
     * @memberof pong.JoinFailed
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    JoinFailed.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.JoinFailed";
    };

    return JoinFailed;
  })();

  pong.OpponentLeft = (function () {
    /**
     * Properties of an OpponentLeft.
     * @memberof pong
     * @interface IOpponentLeft
     */

    /**
     * Constructs a new OpponentLeft.
     * @memberof pong
     * @classdesc Represents an OpponentLeft.
     * @implements IOpponentLeft
     * @constructor
     * @param {pong.IOpponentLeft=} [properties] Properties to set
     */
    function OpponentLeft(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new OpponentLeft instance using the specified properties.
     * @function create
     * @memberof pong.OpponentLeft
     * @static
     * @param {pong.IOpponentLeft=} [properties] Properties to set
     * @returns {pong.OpponentLeft} OpponentLeft instance
     */
    OpponentLeft.create = function create(properties) {
      return new OpponentLeft(properties);
    };

    /**
     * Encodes the specified OpponentLeft message. Does not implicitly {@link pong.OpponentLeft.verify|verify} messages.
     * @function encode
     * @memberof pong.OpponentLeft
     * @static
     * @param {pong.IOpponentLeft} message OpponentLeft message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpponentLeft.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      return writer;
    };

    /**
     * Encodes the specified OpponentLeft message, length delimited. Does not implicitly {@link pong.OpponentLeft.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.OpponentLeft
     * @static
     * @param {pong.IOpponentLeft} message OpponentLeft message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    OpponentLeft.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes an OpponentLeft message from the specified reader or buffer.
     * @function decode
     * @memberof pong.OpponentLeft
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.OpponentLeft} OpponentLeft
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpponentLeft.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.OpponentLeft();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes an OpponentLeft message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.OpponentLeft
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.OpponentLeft} OpponentLeft
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    OpponentLeft.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies an OpponentLeft message.
     * @function verify
     * @memberof pong.OpponentLeft
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    OpponentLeft.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      return null;
    };

    /**
     * Creates an OpponentLeft message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.OpponentLeft
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.OpponentLeft} OpponentLeft
     */
    OpponentLeft.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.OpponentLeft) return object;
      return new $root.pong.OpponentLeft();
    };

    /**
     * Creates a plain object from an OpponentLeft message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.OpponentLeft
     * @static
     * @param {pong.OpponentLeft} message OpponentLeft
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    OpponentLeft.toObject = function toObject() {
      return {};
    };

    /**
     * Converts this OpponentLeft to JSON.
     * @function toJSON
     * @memberof pong.OpponentLeft
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    OpponentLeft.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for OpponentLeft
     * @function getTypeUrl
     * @memberof pong.OpponentLeft
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    OpponentLeft.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.OpponentLeft";
    };

    return OpponentLeft;
  })();

  pong.GameState = (function () {
    /**
     * Properties of a GameState.
     * @memberof pong
     * @interface IGameState
     * @property {number|null} [ballX] GameState ballX
     * @property {number|null} [ballY] GameState ballY
     * @property {number|null} [leftPaddleY] GameState leftPaddleY
     * @property {number|null} [rightPaddleY] GameState rightPaddleY
     * @property {number|null} [leftScore] GameState leftScore
     * @property {number|null} [rightScore] GameState rightScore
     * @property {boolean|null} [waitingForServe] GameState waitingForServe
     * @property {pong.Side|null} [servingSide] GameState servingSide
     */

    /**
     * Constructs a new GameState.
     * @memberof pong
     * @classdesc Represents a GameState.
     * @implements IGameState
     * @constructor
     * @param {pong.IGameState=} [properties] Properties to set
     */
    function GameState(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * GameState ballX.
     * @member {number} ballX
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.ballX = 0;

    /**
     * GameState ballY.
     * @member {number} ballY
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.ballY = 0;

    /**
     * GameState leftPaddleY.
     * @member {number} leftPaddleY
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.leftPaddleY = 0;

    /**
     * GameState rightPaddleY.
     * @member {number} rightPaddleY
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.rightPaddleY = 0;

    /**
     * GameState leftScore.
     * @member {number} leftScore
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.leftScore = 0;

    /**
     * GameState rightScore.
     * @member {number} rightScore
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.rightScore = 0;

    /**
     * GameState waitingForServe.
     * @member {boolean} waitingForServe
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.waitingForServe = false;

    /**
     * GameState servingSide.
     * @member {pong.Side} servingSide
     * @memberof pong.GameState
     * @instance
     */
    GameState.prototype.servingSide = 0;

    /**
     * Creates a new GameState instance using the specified properties.
     * @function create
     * @memberof pong.GameState
     * @static
     * @param {pong.IGameState=} [properties] Properties to set
     * @returns {pong.GameState} GameState instance
     */
    GameState.create = function create(properties) {
      return new GameState(properties);
    };

    /**
     * Encodes the specified GameState message. Does not implicitly {@link pong.GameState.verify|verify} messages.
     * @function encode
     * @memberof pong.GameState
     * @static
     * @param {pong.IGameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (message.ballX != null && Object.hasOwnProperty.call(message, "ballX"))
        writer.uint32(/* id 1, wireType 5 =*/ 13).float(message.ballX);
      if (message.ballY != null && Object.hasOwnProperty.call(message, "ballY"))
        writer.uint32(/* id 2, wireType 5 =*/ 21).float(message.ballY);
      if (
        message.leftPaddleY != null &&
        Object.hasOwnProperty.call(message, "leftPaddleY")
      )
        writer.uint32(/* id 3, wireType 5 =*/ 29).float(message.leftPaddleY);
      if (
        message.rightPaddleY != null &&
        Object.hasOwnProperty.call(message, "rightPaddleY")
      )
        writer.uint32(/* id 4, wireType 5 =*/ 37).float(message.rightPaddleY);
      if (
        message.leftScore != null &&
        Object.hasOwnProperty.call(message, "leftScore")
      )
        writer.uint32(/* id 5, wireType 0 =*/ 40).uint32(message.leftScore);
      if (
        message.rightScore != null &&
        Object.hasOwnProperty.call(message, "rightScore")
      )
        writer.uint32(/* id 6, wireType 0 =*/ 48).uint32(message.rightScore);
      if (
        message.waitingForServe != null &&
        Object.hasOwnProperty.call(message, "waitingForServe")
      )
        writer.uint32(/* id 7, wireType 0 =*/ 56).bool(message.waitingForServe);
      if (
        message.servingSide != null &&
        Object.hasOwnProperty.call(message, "servingSide")
      )
        writer.uint32(/* id 8, wireType 0 =*/ 64).int32(message.servingSide);
      return writer;
    };

    /**
     * Encodes the specified GameState message, length delimited. Does not implicitly {@link pong.GameState.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.GameState
     * @static
     * @param {pong.IGameState} message GameState message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    GameState.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a GameState message from the specified reader or buffer.
     * @function decode
     * @memberof pong.GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.GameState();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.ballX = reader.float();
            break;
          }
          case 2: {
            message.ballY = reader.float();
            break;
          }
          case 3: {
            message.leftPaddleY = reader.float();
            break;
          }
          case 4: {
            message.rightPaddleY = reader.float();
            break;
          }
          case 5: {
            message.leftScore = reader.uint32();
            break;
          }
          case 6: {
            message.rightScore = reader.uint32();
            break;
          }
          case 7: {
            message.waitingForServe = reader.bool();
            break;
          }
          case 8: {
            message.servingSide = reader.int32();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a GameState message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.GameState
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.GameState} GameState
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    GameState.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a GameState message.
     * @function verify
     * @memberof pong.GameState
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    GameState.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.ballX != null && message.hasOwnProperty("ballX"))
        if (typeof message.ballX !== "number") return "ballX: number expected";
      if (message.ballY != null && message.hasOwnProperty("ballY"))
        if (typeof message.ballY !== "number") return "ballY: number expected";
      if (message.leftPaddleY != null && message.hasOwnProperty("leftPaddleY"))
        if (typeof message.leftPaddleY !== "number")
          return "leftPaddleY: number expected";
      if (
        message.rightPaddleY != null &&
        message.hasOwnProperty("rightPaddleY")
      )
        if (typeof message.rightPaddleY !== "number")
          return "rightPaddleY: number expected";
      if (message.leftScore != null && message.hasOwnProperty("leftScore"))
        if (!$util.isInteger(message.leftScore))
          return "leftScore: integer expected";
      if (message.rightScore != null && message.hasOwnProperty("rightScore"))
        if (!$util.isInteger(message.rightScore))
          return "rightScore: integer expected";
      if (
        message.waitingForServe != null &&
        message.hasOwnProperty("waitingForServe")
      )
        if (typeof message.waitingForServe !== "boolean")
          return "waitingForServe: boolean expected";
      if (message.servingSide != null && message.hasOwnProperty("servingSide"))
        switch (message.servingSide) {
          default:
            return "servingSide: enum value expected";
          case 0:
          case 1:
            break;
        }
      return null;
    };

    /**
     * Creates a GameState message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.GameState
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.GameState} GameState
     */
    GameState.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.GameState) return object;
      let message = new $root.pong.GameState();
      if (object.ballX != null) message.ballX = Number(object.ballX);
      if (object.ballY != null) message.ballY = Number(object.ballY);
      if (object.leftPaddleY != null)
        message.leftPaddleY = Number(object.leftPaddleY);
      if (object.rightPaddleY != null)
        message.rightPaddleY = Number(object.rightPaddleY);
      if (object.leftScore != null) message.leftScore = object.leftScore >>> 0;
      if (object.rightScore != null)
        message.rightScore = object.rightScore >>> 0;
      if (object.waitingForServe != null)
        message.waitingForServe = Boolean(object.waitingForServe);
      switch (object.servingSide) {
        default:
          if (typeof object.servingSide === "number") {
            message.servingSide = object.servingSide;
            break;
          }
          break;
        case "LEFT":
        case 0:
          message.servingSide = 0;
          break;
        case "RIGHT":
        case 1:
          message.servingSide = 1;
          break;
      }
      return message;
    };

    /**
     * Creates a plain object from a GameState message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.GameState
     * @static
     * @param {pong.GameState} message GameState
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    GameState.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) {
        object.ballX = 0;
        object.ballY = 0;
        object.leftPaddleY = 0;
        object.rightPaddleY = 0;
        object.leftScore = 0;
        object.rightScore = 0;
        object.waitingForServe = false;
        object.servingSide = options.enums === String ? "LEFT" : 0;
      }
      if (message.ballX != null && message.hasOwnProperty("ballX"))
        object.ballX =
          options.json && !isFinite(message.ballX)
            ? String(message.ballX)
            : message.ballX;
      if (message.ballY != null && message.hasOwnProperty("ballY"))
        object.ballY =
          options.json && !isFinite(message.ballY)
            ? String(message.ballY)
            : message.ballY;
      if (message.leftPaddleY != null && message.hasOwnProperty("leftPaddleY"))
        object.leftPaddleY =
          options.json && !isFinite(message.leftPaddleY)
            ? String(message.leftPaddleY)
            : message.leftPaddleY;
      if (
        message.rightPaddleY != null &&
        message.hasOwnProperty("rightPaddleY")
      )
        object.rightPaddleY =
          options.json && !isFinite(message.rightPaddleY)
            ? String(message.rightPaddleY)
            : message.rightPaddleY;
      if (message.leftScore != null && message.hasOwnProperty("leftScore"))
        object.leftScore = message.leftScore;
      if (message.rightScore != null && message.hasOwnProperty("rightScore"))
        object.rightScore = message.rightScore;
      if (
        message.waitingForServe != null &&
        message.hasOwnProperty("waitingForServe")
      )
        object.waitingForServe = message.waitingForServe;
      if (message.servingSide != null && message.hasOwnProperty("servingSide"))
        object.servingSide =
          options.enums === String
            ? $root.pong.Side[message.servingSide] === undefined
              ? message.servingSide
              : $root.pong.Side[message.servingSide]
            : message.servingSide;
      return object;
    };

    /**
     * Converts this GameState to JSON.
     * @function toJSON
     * @memberof pong.GameState
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    GameState.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for GameState
     * @function getTypeUrl
     * @memberof pong.GameState
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    GameState.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.GameState";
    };

    return GameState;
  })();

  pong.ClientMessage = (function () {
    /**
     * Properties of a ClientMessage.
     * @memberof pong
     * @interface IClientMessage
     * @property {pong.IRematchRequest|null} [rematchRequest] ClientMessage rematchRequest
     */

    /**
     * Constructs a new ClientMessage.
     * @memberof pong
     * @classdesc Represents a ClientMessage.
     * @implements IClientMessage
     * @constructor
     * @param {pong.IClientMessage=} [properties] Properties to set
     */
    function ClientMessage(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * ClientMessage rematchRequest.
     * @member {pong.IRematchRequest|null|undefined} rematchRequest
     * @memberof pong.ClientMessage
     * @instance
     */
    ClientMessage.prototype.rematchRequest = null;

    // OneOf field names bound to virtual getters and setters
    let $oneOfFields;

    /**
     * ClientMessage payload.
     * @member {"rematchRequest"|undefined} payload
     * @memberof pong.ClientMessage
     * @instance
     */
    Object.defineProperty(ClientMessage.prototype, "payload", {
      get: $util.oneOfGetter(($oneOfFields = ["rematchRequest"])),
      set: $util.oneOfSetter($oneOfFields),
    });

    /**
     * Creates a new ClientMessage instance using the specified properties.
     * @function create
     * @memberof pong.ClientMessage
     * @static
     * @param {pong.IClientMessage=} [properties] Properties to set
     * @returns {pong.ClientMessage} ClientMessage instance
     */
    ClientMessage.create = function create(properties) {
      return new ClientMessage(properties);
    };

    /**
     * Encodes the specified ClientMessage message. Does not implicitly {@link pong.ClientMessage.verify|verify} messages.
     * @function encode
     * @memberof pong.ClientMessage
     * @static
     * @param {pong.IClientMessage} message ClientMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientMessage.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.rematchRequest != null &&
        Object.hasOwnProperty.call(message, "rematchRequest")
      )
        $root.pong.RematchRequest.encode(
          message.rematchRequest,
          writer.uint32(/* id 1, wireType 2 =*/ 10).fork(),
        ).ldelim();
      return writer;
    };

    /**
     * Encodes the specified ClientMessage message, length delimited. Does not implicitly {@link pong.ClientMessage.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.ClientMessage
     * @static
     * @param {pong.IClientMessage} message ClientMessage message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    ClientMessage.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a ClientMessage message from the specified reader or buffer.
     * @function decode
     * @memberof pong.ClientMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.ClientMessage} ClientMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientMessage.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.ClientMessage();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.rematchRequest = $root.pong.RematchRequest.decode(
              reader,
              reader.uint32(),
            );
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a ClientMessage message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.ClientMessage
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.ClientMessage} ClientMessage
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    ClientMessage.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a ClientMessage message.
     * @function verify
     * @memberof pong.ClientMessage
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    ClientMessage.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      let properties = {};
      if (
        message.rematchRequest != null &&
        message.hasOwnProperty("rematchRequest")
      ) {
        properties.payload = 1;
        {
          let error = $root.pong.RematchRequest.verify(message.rematchRequest);
          if (error) return "rematchRequest." + error;
        }
      }
      return null;
    };

    /**
     * Creates a ClientMessage message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.ClientMessage
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.ClientMessage} ClientMessage
     */
    ClientMessage.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.ClientMessage) return object;
      let message = new $root.pong.ClientMessage();
      if (object.rematchRequest != null) {
        if (typeof object.rematchRequest !== "object")
          throw TypeError(
            ".pong.ClientMessage.rematchRequest: object expected",
          );
        message.rematchRequest = $root.pong.RematchRequest.fromObject(
          object.rematchRequest,
        );
      }
      return message;
    };

    /**
     * Creates a plain object from a ClientMessage message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.ClientMessage
     * @static
     * @param {pong.ClientMessage} message ClientMessage
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    ClientMessage.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (
        message.rematchRequest != null &&
        message.hasOwnProperty("rematchRequest")
      ) {
        object.rematchRequest = $root.pong.RematchRequest.toObject(
          message.rematchRequest,
          options,
        );
        if (options.oneofs) object.payload = "rematchRequest";
      }
      return object;
    };

    /**
     * Converts this ClientMessage to JSON.
     * @function toJSON
     * @memberof pong.ClientMessage
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    ClientMessage.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for ClientMessage
     * @function getTypeUrl
     * @memberof pong.ClientMessage
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    ClientMessage.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.ClientMessage";
    };

    return ClientMessage;
  })();

  pong.RematchRequest = (function () {
    /**
     * Properties of a RematchRequest.
     * @memberof pong
     * @interface IRematchRequest
     */

    /**
     * Constructs a new RematchRequest.
     * @memberof pong
     * @classdesc Represents a RematchRequest.
     * @implements IRematchRequest
     * @constructor
     * @param {pong.IRematchRequest=} [properties] Properties to set
     */
    function RematchRequest(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * Creates a new RematchRequest instance using the specified properties.
     * @function create
     * @memberof pong.RematchRequest
     * @static
     * @param {pong.IRematchRequest=} [properties] Properties to set
     * @returns {pong.RematchRequest} RematchRequest instance
     */
    RematchRequest.create = function create(properties) {
      return new RematchRequest(properties);
    };

    /**
     * Encodes the specified RematchRequest message. Does not implicitly {@link pong.RematchRequest.verify|verify} messages.
     * @function encode
     * @memberof pong.RematchRequest
     * @static
     * @param {pong.IRematchRequest} message RematchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RematchRequest.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      return writer;
    };

    /**
     * Encodes the specified RematchRequest message, length delimited. Does not implicitly {@link pong.RematchRequest.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.RematchRequest
     * @static
     * @param {pong.IRematchRequest} message RematchRequest message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    RematchRequest.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a RematchRequest message from the specified reader or buffer.
     * @function decode
     * @memberof pong.RematchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.RematchRequest} RematchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RematchRequest.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.RematchRequest();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a RematchRequest message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.RematchRequest
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.RematchRequest} RematchRequest
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    RematchRequest.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a RematchRequest message.
     * @function verify
     * @memberof pong.RematchRequest
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    RematchRequest.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      return null;
    };

    /**
     * Creates a RematchRequest message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.RematchRequest
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.RematchRequest} RematchRequest
     */
    RematchRequest.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.RematchRequest) return object;
      return new $root.pong.RematchRequest();
    };

    /**
     * Creates a plain object from a RematchRequest message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.RematchRequest
     * @static
     * @param {pong.RematchRequest} message RematchRequest
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    RematchRequest.toObject = function toObject() {
      return {};
    };

    /**
     * Converts this RematchRequest to JSON.
     * @function toJSON
     * @memberof pong.RematchRequest
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    RematchRequest.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for RematchRequest
     * @function getTypeUrl
     * @memberof pong.RematchRequest
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    RematchRequest.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.RematchRequest";
    };

    return RematchRequest;
  })();

  pong.PlayerInput = (function () {
    /**
     * Properties of a PlayerInput.
     * @memberof pong
     * @interface IPlayerInput
     * @property {number|null} [direction] PlayerInput direction
     */

    /**
     * Constructs a new PlayerInput.
     * @memberof pong
     * @classdesc Represents a PlayerInput.
     * @implements IPlayerInput
     * @constructor
     * @param {pong.IPlayerInput=} [properties] Properties to set
     */
    function PlayerInput(properties) {
      if (properties)
        for (let keys = Object.keys(properties), i = 0; i < keys.length; ++i)
          if (properties[keys[i]] != null) this[keys[i]] = properties[keys[i]];
    }

    /**
     * PlayerInput direction.
     * @member {number} direction
     * @memberof pong.PlayerInput
     * @instance
     */
    PlayerInput.prototype.direction = 0;

    /**
     * Creates a new PlayerInput instance using the specified properties.
     * @function create
     * @memberof pong.PlayerInput
     * @static
     * @param {pong.IPlayerInput=} [properties] Properties to set
     * @returns {pong.PlayerInput} PlayerInput instance
     */
    PlayerInput.create = function create(properties) {
      return new PlayerInput(properties);
    };

    /**
     * Encodes the specified PlayerInput message. Does not implicitly {@link pong.PlayerInput.verify|verify} messages.
     * @function encode
     * @memberof pong.PlayerInput
     * @static
     * @param {pong.IPlayerInput} message PlayerInput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerInput.encode = function encode(message, writer) {
      if (!writer) writer = $Writer.create();
      if (
        message.direction != null &&
        Object.hasOwnProperty.call(message, "direction")
      )
        writer.uint32(/* id 1, wireType 0 =*/ 8).sint32(message.direction);
      return writer;
    };

    /**
     * Encodes the specified PlayerInput message, length delimited. Does not implicitly {@link pong.PlayerInput.verify|verify} messages.
     * @function encodeDelimited
     * @memberof pong.PlayerInput
     * @static
     * @param {pong.IPlayerInput} message PlayerInput message or plain object to encode
     * @param {$protobuf.Writer} [writer] Writer to encode to
     * @returns {$protobuf.Writer} Writer
     */
    PlayerInput.encodeDelimited = function encodeDelimited(message, writer) {
      return this.encode(message, writer).ldelim();
    };

    /**
     * Decodes a PlayerInput message from the specified reader or buffer.
     * @function decode
     * @memberof pong.PlayerInput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @param {number} [length] Message length if known beforehand
     * @returns {pong.PlayerInput} PlayerInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerInput.decode = function decode(reader, length, error) {
      if (!(reader instanceof $Reader)) reader = $Reader.create(reader);
      let end = length === undefined ? reader.len : reader.pos + length,
        message = new $root.pong.PlayerInput();
      while (reader.pos < end) {
        let tag = reader.uint32();
        if (tag === error) break;
        switch (tag >>> 3) {
          case 1: {
            message.direction = reader.sint32();
            break;
          }
          default:
            reader.skipType(tag & 7);
            break;
        }
      }
      return message;
    };

    /**
     * Decodes a PlayerInput message from the specified reader or buffer, length delimited.
     * @function decodeDelimited
     * @memberof pong.PlayerInput
     * @static
     * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
     * @returns {pong.PlayerInput} PlayerInput
     * @throws {Error} If the payload is not a reader or valid buffer
     * @throws {$protobuf.util.ProtocolError} If required fields are missing
     */
    PlayerInput.decodeDelimited = function decodeDelimited(reader) {
      if (!(reader instanceof $Reader)) reader = new $Reader(reader);
      return this.decode(reader, reader.uint32());
    };

    /**
     * Verifies a PlayerInput message.
     * @function verify
     * @memberof pong.PlayerInput
     * @static
     * @param {Object.<string,*>} message Plain object to verify
     * @returns {string|null} `null` if valid, otherwise the reason why it is not
     */
    PlayerInput.verify = function verify(message) {
      if (typeof message !== "object" || message === null)
        return "object expected";
      if (message.direction != null && message.hasOwnProperty("direction"))
        if (!$util.isInteger(message.direction))
          return "direction: integer expected";
      return null;
    };

    /**
     * Creates a PlayerInput message from a plain object. Also converts values to their respective internal types.
     * @function fromObject
     * @memberof pong.PlayerInput
     * @static
     * @param {Object.<string,*>} object Plain object
     * @returns {pong.PlayerInput} PlayerInput
     */
    PlayerInput.fromObject = function fromObject(object) {
      if (object instanceof $root.pong.PlayerInput) return object;
      let message = new $root.pong.PlayerInput();
      if (object.direction != null) message.direction = object.direction | 0;
      return message;
    };

    /**
     * Creates a plain object from a PlayerInput message. Also converts values to other types if specified.
     * @function toObject
     * @memberof pong.PlayerInput
     * @static
     * @param {pong.PlayerInput} message PlayerInput
     * @param {$protobuf.IConversionOptions} [options] Conversion options
     * @returns {Object.<string,*>} Plain object
     */
    PlayerInput.toObject = function toObject(message, options) {
      if (!options) options = {};
      let object = {};
      if (options.defaults) object.direction = 0;
      if (message.direction != null && message.hasOwnProperty("direction"))
        object.direction = message.direction;
      return object;
    };

    /**
     * Converts this PlayerInput to JSON.
     * @function toJSON
     * @memberof pong.PlayerInput
     * @instance
     * @returns {Object.<string,*>} JSON object
     */
    PlayerInput.prototype.toJSON = function toJSON() {
      return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
    };

    /**
     * Gets the default type url for PlayerInput
     * @function getTypeUrl
     * @memberof pong.PlayerInput
     * @static
     * @param {string} [typeUrlPrefix] your custom typeUrlPrefix(default "type.googleapis.com")
     * @returns {string} The default type url
     */
    PlayerInput.getTypeUrl = function getTypeUrl(typeUrlPrefix) {
      if (typeUrlPrefix === undefined) {
        typeUrlPrefix = "type.googleapis.com";
      }
      return typeUrlPrefix + "/pong.PlayerInput";
    };

    return PlayerInput;
  })();

  return pong;
})());

export { $root as default };
