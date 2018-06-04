'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passAlong = exports.DataLoader = exports.createReducer = exports.createActionNamespace = exports.bindDispatch = exports.AutoTrigger = undefined;

var _reducer = require('./reducer');

var _dispatch = require('./dispatch');

var _actions = require('./actions');

var _actions2 = _interopRequireDefault(_actions);

var _dataLoader = require('./components/data-loader');

var _dataLoader2 = _interopRequireDefault(_dataLoader);

var _autoTrigger = require('./components/auto-trigger');

var _autoTrigger2 = _interopRequireDefault(_autoTrigger);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.AutoTrigger = _autoTrigger2.default;
exports.bindDispatch = _dispatch.bindDispatch;
exports.createActionNamespace = _actions2.default;
exports.createReducer = _reducer.createReducer;
exports.DataLoader = _dataLoader2.default;
exports.passAlong = _reducer.passAlong;