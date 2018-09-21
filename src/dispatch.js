/**
 * bindDispatch - Takes an object whose keys are `props` and whose values
 * are functions that return actions. These actions will be passed to
 * `dispatch`. Designed to remove boilerplate of calling `dispatch` explicitly.
 *
 * The call to the original action creator will also:
 * - Default the first argument to `{}` if none is passed.
 * - Pass `ownProps` as the last argument to the action creator
 *
 * Additionally, if `$meta` is passed into `bindDispatch`, the values in `$meta`
 * will be added to the dispatched action.
 *
 * @param {object} props Keys are props, values are functions that return
 * actions.
 * @param {object} $meta This object will be merged into the dispatched action.
 *
 * @returns {function} Returns a `mapDispatchToProps` function.
 */
export const bindDispatch = (props, $meta = {}) => (dispatch, ownProps) =>
  // Recreate the key/value structure of props...
  Object.keys(props).reduce(
    (acc, key) => ({
      ...acc,
      // ... but wrap each value/original action creator in the following function
      [key]: (...args) => {
        // `key` is the property name in `props`/`dispatchProps`
        // `args` are the arguments passed into the action creator
        // `props[key]` is the original action creator
        let initAction;
        if (args.length === 0) {
          // Default the first argument to `{}` if none is passed before
          // calling the original action creator.
          // Pass `ownProps` as the last argument
          initAction = props[key]({}, ownProps);
        } else {
          // Call the original action creator, and pass `ownProps` as the
          // last argument
          initAction = props[key](...args, ownProps);
        }

        // Add `$meta` to the dispatched action
        const action = {
          ...initAction,
          $meta: { ...(initAction.$meta || {}), ...$meta }
        };
        return dispatch(action);
      }
    }),
    {}
  );
