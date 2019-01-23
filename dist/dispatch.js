"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
var bindDispatch = exports.bindDispatch = function bindDispatch(props) {
  var $meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, ownProps) {
    return (
      // Recreate the key/value structure of props...
      Object.keys(props).reduce(function (acc, key) {
        return _extends({}, acc, _defineProperty({}, key, function () {
          for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }

          // `key` is the property name in `props`/`dispatchProps`
          // `args` are the arguments passed into the action creator
          // `props[key]` is the original action creator
          var initAction = void 0;
          if (args.length === 0) {
            // Default the first argument to `{}` if none is passed before
            // calling the original action creator.
            // Pass `ownProps` as the last argument
            initAction = props[key]({}, ownProps);
          } else {
            // Call the original action creator, and pass `ownProps` as the
            // last argument
            initAction = props[key].apply(props, args.concat([ownProps]));
          }

          // Add `$meta` to the dispatched action
          var action = _extends({}, initAction, {
            $meta: _extends({}, initAction.$meta || {}, $meta)
          });
          return dispatch(action);
        }));
      }, {})
    );
  };
};