'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @var {object} namespaces A singleton object for making sure namespaces are
 * unique in the app.
 */
var namespaces = {};

var createActionNamespace = function createActionNamespace(namespace) {
  if (namespace in namespaces) {
    throw new Error(namespace + ' is already an action namespace.');
  }

  /**
   * @var {object} actions A singleton that contains every action added
   * to the namespace.
   */
  var actions = {};

  namespaces[namespace] = actions;

  /**
   * verifyPayload - Compares an array of expected keys to an object. Will return
   * false if the object does not contain a key for each item in the array. Will
   * _not_ return false if extra keys exist, as long as the expected keys do.
   *
   * @param {array}   properties  An array of expected property names.
   * @param {object} [payload={}] An object whose keys will be compared to the
   * properties array.
   *
   * @returns {boolean} `true` if each item in the properties array has a
   * corrosponding key in the payload object. `false` otherwise.
   */
  var verifyPayload = function verifyPayload(properties) {
    var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    return properties.reduce(function (acc, prop) {
      return acc && prop in payload;
    }, true);
  };

  /**
   * makeAction - Takes a type and properties and returns a function for generating
   * the action object with the given type and properties. Will throw and error
   * if the payload doesn't match the expected properties.
   *
   * @param {string} type     The action type.
   * @param {array} properties The properties for the action.
   * @param {object} $meta $meta properies are properties that aren't used for
   * changing state, but are used for customizing how to work with Redux.
   *
   * @returns {function} A function for generating an action object.
   */
  var createAction = function createAction(type) {
    var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var $meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    var namespacedType = namespace + ' ' + type;
    var actionFn = function actionFn() {
      var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var $localMeta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      if ((typeof payload === 'undefined' ? 'undefined' : _typeof(payload)) !== 'object') {
        throw new Error('Actions must dispatch an object. Check ' + type);
      }
      if (!verifyPayload(properties, payload)) {
        throw new Error(namespacedType + ' dispatched with incorrect properties.\n        Expected ' + properties + ', but received ' + Object.keys(payload));
      }

      return _extends({}, payload, {
        type: namespacedType,
        $meta: _extends({ namespace: namespace }, $meta, $localMeta)
      });
    };

    actionFn.type = namespacedType;
    return actionFn;
  };

  /**
   * addAction - Adds an action to the `actions` singleton if the action does
   * not already exist.
   *
   * @param {string} type     The action type.
   * @param {array} properties The properties for the action.
   * @param {object} $meta $meta properies are properties that aren't used for
   * changing state, but are used for customizing how to work with Redux.
   *
   * @returns {undefined} No return value.
   */
  var addAction = function addAction(type) {
    var properties = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    var $meta = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

    if (type in actions) {
      throw new Error(type + ' is already an action.');
    }

    if (Array.isArray(properties)) {
      actions[type] = createAction(type, properties, $meta);
    } else {
      var actualProperties = properties.properties;
      var $actionMeta = properties.$meta;
      actions[type] = createAction(type, actualProperties, _extends({}, $meta, $actionMeta));
    }
  };

  /**
   * addActions - Adds a set of actions to the `actions` singleton.
   *
   * @param {object} actionObject Object whose keys are the action types,
   * and whose values are arrays of the expected properties for the action.
   * @param {object} $meta $meta properies are properties that aren't used for
   * changing state, but are used for customizing how to work with Redux.
   *
   * @returns {object} Set of actions
   */
  var addActions = function addActions(actionObject) {
    var $meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    Object.keys(actionObject).forEach(function (key) {
      return addAction(key, actionObject[key], $meta);
    });
    return actions;
  };

  var getActions = function getActions() {
    return actions;
  };

  return {
    addActions: addActions,
    getActions: getActions,
    namespace: namespace
  };
};

exports.default = createActionNamespace;