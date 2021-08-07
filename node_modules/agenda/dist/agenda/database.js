"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.database = void 0;
const mongodb_1 = require("mongodb");
const debug_1 = __importDefault(require("debug"));
const has_mongo_protocol_1 = require("./has-mongo-protocol");
const debug = debug_1.default("agenda:database");
/**
 * Connect to the spec'd MongoDB server and database.
 * @name Agenda#database
 * @function
 * @param url MongoDB server URI
 * @param [collection] name of collection to use. Defaults to `agendaJobs`
 * @param [options] options for connecting
 * @param [cb] callback of MongoDB connection
 * NOTE:
 * If `url` includes auth details then `options` must specify: { 'uri_decode_auth': true }. This does Auth on
 * the specified database, not the Admin database. If you are using Auth on the Admin DB and not on the Agenda DB,
 * then you need to authenticate against the Admin DB and then pass the MongoDB instance into the constructor
 * or use Agenda.mongo(). If your app already has a MongoDB connection then use that. ie. specify config.mongo in
 * the constructor or use Agenda.mongo().
 */
const database = function (url, collection, options, cb) {
    if (!has_mongo_protocol_1.hasMongoProtocol(url)) {
        url = "mongodb://" + url;
    }
    const reconnectOptions = (options === null || options === void 0 ? void 0 : options.useUnifiedTopology) === true
        ? {}
        : {
            autoReconnect: true,
            reconnectTries: Number.MAX_SAFE_INTEGER,
            reconnectInterval: this._processEvery,
        };
    collection = collection || "agendaJobs";
    options = Object.assign(Object.assign({}, reconnectOptions), options);
    mongodb_1.MongoClient.connect(url, options, (error, client) => {
        if (error) {
            debug("error connecting to MongoDB using collection: [%s]", collection);
            if (cb) {
                cb(error, null);
            }
            else {
                throw error;
            }
            return;
        }
        debug("successful connection to MongoDB using collection: [%s]", collection);
        this._db = client;
        this._mdb = client.db();
        this.db_init(collection, cb);
    });
    return this;
};
exports.database = database;
//# sourceMappingURL=database.js.map