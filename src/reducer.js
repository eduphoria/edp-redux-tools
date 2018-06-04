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
export const createReducer = (actions, initialState) => (
  state = initialState,
  action = {}
) => {
  if (action.type in actions) {
    return actions[action.type](state, action);
  }
  if ('default' in actions) {
    return actions.default(state, action);
  }
  return state;
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
export const createPassAlong = (
  namespaces = [],
  prop,
  subreducer,
  conditional = () => true
) => (state, action) => {
  if (action.$meta && namespaces.includes(action.$meta.namespace)) {
    const oldState = state[prop];
    if (conditional(action, oldState)) {
      const newState = subreducer(oldState, action);

      return newState === oldState
        ? state
        : {
            ...state,
            [prop]: newState
          };
    }

    return state;
  }

  return state;
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
export const createListReducer = (propertyName, reducer, conditional) => (
  state,
  action
) => {
  const list = state[propertyName] || [];
  const newList = list.reduce((acc, item, idx) => {
    if (conditional(action, item, idx)) {
      const newAcc = [...acc];
      newAcc[idx] = reducer(item, action);
      return newAcc;
    }
    return acc;
  }, list);

  if (list === newList) {
    return state;
  }

  return { ...state, [propertyName]: newList };
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
export const createListPassAlong = (
  namespaces = [],
  propertyName,
  reducer,
  conditional
) => {
  const listReducer = createListReducer(propertyName, reducer, conditional);
  return (state, action) => {
    if (action.$meta && namespaces.includes(action.$meta.namespace)) {
      return listReducer(state, action);
    }

    return state;
  };
};

export const composeReducers = reducers => (state, action) =>
  reducers.reduce((acc, reducer) => reducer(acc, action), state);

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

export const createSubReducer = (
  prop,
  subreducer,
  conditional = () => true
) => (state, action) => {
  const oldState = state[prop];
  if (conditional(action, oldState)) {
    const newState = subreducer(oldState, action);

    return newState === oldState
      ? state
      : {
          ...state,
          [prop]: newState
        };
  }

  return state;
};
