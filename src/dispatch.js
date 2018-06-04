/**
 * bindDispatch - Takes an object whose keys are `props` and whose values
 * are functions that return actions. These actions will be passed to
 * `dispatch`. Designed to remove boilerplate of calling `dispatch` explicitly.
 * Additionally, if the component has a $id prop, this will be added to the
 * dispatched action.
 *
 * @param {object} props Keys are props, values are functions that return
 * actions.
 *
 * @returns {function} Returns a `mapDispatchToProps` function.
 */
export const bindDispatch = (props, $meta = {}) => (dispatch, ownProps) =>
  Object.keys(props).reduce(
    (acc, key) => ({
      ...acc,
      [key]: (...args) => {
        let initAction;
        if (args.length === 0) {
          initAction = props[key]({}, ownProps);
        } else {
          initAction = props[key](...args, ownProps);
        }

        const action = {
          ...initAction,
          $meta: { ...(initAction.$meta || {}), ...$meta }
        };
        return dispatch(action);
      }
    }),
    {}
  );
