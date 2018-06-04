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
 * passAlong - Creates a new reducer that will pass a slice of state along
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
export const passAlong = (namespaces = [], prop, subreducer) => (
  state,
  action
) => {
  if (action.$meta && namespaces.includes(action.$meta.namespace)) {
    const oldState = state[prop];
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
