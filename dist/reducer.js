'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * createReducer - An alternative to creating a reducer with switch statement.
 * This function allows an array of reducer enhancers to be passed in.
 *
 * @param {object}  actions               An object which keys match potential
 * action types, and whose values are functions that take `(state, action)` an
 * return the new state.
 * @param {object}  initialState          The inital state for the reducer.
 * @param {array} [reducerEnhancers=[]]   An array of `enhanceReducer` calls.
 *
 * @returns {function} A new reducer.
 */
var createReducer = exports.createReducer = function createReducer(actions, initialState) {
  return function () {
    var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : initialState;
    var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (action.type in actions) {
      return actions[action.type](state, action);
    }
    if ('default' in actions) {
      return actions.default(state, action);
    }
    return state;
  };
};

/**
 * createPassAlong - Creates a new reducer that will pass a slice of state along
 * with an action along to a "subreducer" if
 *   1. the action has a `$meta` property with a `namespace` key.
 *   2. The action's namespace matches a string in the `namespaces` arugment.
 * If the resulting slice of state is unchanged from the original slice of
 * state, no changes to the parent state are made. Otherwise, the new slice of
 * stae is updated in the parent state.
 *
 * @param {array} [namespaces=[string]] Allowed action namespaces that will
 * pass through
 * @param {string}  prop The prop that will be used to pass a part of the state
 * along to the subreducer.
 * @param {function}  subreducer A reducer.
 *
 * @returns {function} A reducer.
 */
var createPassAlong = exports.createPassAlong = function createPassAlong() {
  var namespaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var prop = arguments[1];
  var subreducer = arguments[2];
  var conditional = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function () {
    return true;
  };
  return function (state, action) {
    if (action.$meta && namespaces.includes(action.$meta.namespace)) {
      var oldState = state[prop];
      if (conditional(action, oldState)) {
        var newState = subreducer(oldState, action);

        return newState === oldState ? state : _extends({}, state, _defineProperty({}, prop, newState));
      }

      return state;
    }

    return state;
  };
};

/**
 * createListReducer - Like createSubreducer, this will create a reducer which
 * will only act on an particular item in a list if a given conditional function
 * returns true.
 *
 * @param {type} conditional  A function that takes an `action`, and `item`,
 * and an `index` should return `true` or `false`
 * @param {type} reducer      The reducer that will receive the slice of state
 * for a given property name from the parent state.
 * @param {type} propertyName The property name from the parent state object
 * that contains the state to pass to the given reducer.
 *
 * @returns {type} Returns a new reducer.
 */
var createListReducer = exports.createListReducer = function createListReducer(propertyName, reducer, conditional) {
  return function (state, action) {
    var list = state[propertyName] || [];
    var newList = list.reduce(function (acc, item, idx) {
      if (conditional(action, item, idx)) {
        var newAcc = [].concat(_toConsumableArray(acc));
        newAcc[idx] = reducer(item, action);
        return newAcc;
      }
      return acc;
    }, list);

    if (list === newList) {
      return state;
    }

    return _extends({}, state, _defineProperty({}, propertyName, newList));
  };
};

/**
 * createListPassAlong - Like createSubreducer, this will create a reducer which
 * will only act on an particular item in a list if a given conditional function
 * returns true.
 *
 * @param {type} conditional  A function that takes an `action`, and `item`,
 * and an `index` should return `true` or `false`
 * @param {type} reducer      The reducer that will receive the slice of state
 * for a given property name from the parent state.
 * @param {type} propertyName The property name from the parent state object
 * that contains the state to pass to the given reducer.
 *
 * @returns {type} Returns a new reducer.
 */
var createListPassAlong = exports.createListPassAlong = function createListPassAlong() {
  var namespaces = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var propertyName = arguments[1];
  var reducer = arguments[2];
  var conditional = arguments[3];

  var listReducer = createListReducer(propertyName, reducer, conditional);
  return function (state, action) {
    if (action.$meta && namespaces.includes(action.$meta.namespace)) {
      return listReducer(state, action);
    }

    return state;
  };
};

var composeReducers = exports.composeReducers = function composeReducers(reducers) {
  return function (state, action) {
    return reducers.reduce(function (acc, reducer) {
      return reducer(acc, action);
    }, state);
  };
};

/**
 * createSubReducer - Creates a new reducer that will pass a slice of state along
 * returns true (it does this by default).
 *
 * If the resulting slice of state is unchanged from the original slice of
 * state, no changes to the parent state are made. Otherwise, the new slice of
 * stae is updated in the parent state.
 * @param {type} conditional  A function that takes an `action`, and `item`,
 * and an `index` should return `true` or `false`
 * @param {type} reducer      The reducer that will receive the slice of state
 * for a given property name from the parent state.
 * @param {type} propertyName The property name from the parent state object
 * that contains the state to pass to the given reducer.
 *
 * @returns {type} Returns a new reducer.
 */

var createSubReducer = exports.createSubReducer = function createSubReducer(prop, subreducer) {
  var conditional = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
    return true;
  };
  return function (state, action) {
    var oldState = state[prop];
    if (conditional(action, oldState)) {
      var newState = subreducer(oldState, action);

      return newState === oldState ? state : _extends({}, state, _defineProperty({}, prop, newState));
    }

    return state;
  };
};