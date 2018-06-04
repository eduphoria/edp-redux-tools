/**
 * @var {object} namespaces A singleton object for making sure namespaces are
 * unique in the app.
 */
const namespaces = {};

const createActionNamespace = namespace => {
  if (namespace in namespaces) {
    throw new Error(`${namespace} is already an action namespace.`);
  }

  /**
   * @var {object} actions A singleton that contains every action added
   * to the namespace.
   */
  const actions = {};

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
  const verifyPayload = (properties, payload = {}) =>
    properties.reduce((acc, prop) => acc && prop in payload, true);

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
  const createAction = (type, properties = [], $meta = {}) => {
    const namespacedType = `${namespace} ${type}`;
    const actionFn = (payload = {}, $localMeta = {}) => {
      if (typeof payload !== 'object') {
        throw new Error(`Actions must dispatch an object. Check ${type}`);
      }
      if (!verifyPayload(properties, payload)) {
        throw new Error(
          `${namespacedType} dispatched with incorrect properties.
        Expected ${properties}, but received ${Object.keys(payload)}`
        );
      }

      return {
        ...payload,
        type: namespacedType,
        $meta: { namespace, ...$meta, ...$localMeta }
      };
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
  const addAction = (type, properties = [], $meta = {}) => {
    if (type in actions) {
      throw new Error(`${type} is already an action.`);
    }

    if (Array.isArray(properties)) {
      actions[type] = createAction(type, properties, $meta);
    } else {
      const actualProperties = properties.properties;
      const $actionMeta = properties.$meta;
      actions[type] = createAction(type, actualProperties, {
        ...$meta,
        ...$actionMeta
      });
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
  const addActions = (actionObject, $meta = {}) => {
    Object.keys(actionObject).forEach(key =>
      addAction(key, actionObject[key], $meta)
    );
    return actions;
  };

  const getActions = () => actions;

  return {
    addActions,
    getActions,
    namespace
  };
};

export default createActionNamespace;
