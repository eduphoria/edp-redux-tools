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
 * Additionally, if the component has a $id prop, this will be added to the
 * dispatched action.
 *
 * @param {object} props Keys are props, values are functions that return
 * actions.
 *
 * @returns {function} Returns a `mapDispatchToProps` function.
 */
var bindDispatch = exports.bindDispatch = function bindDispatch(props) {
  var $meta = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function (dispatch, ownProps) {
    return Object.keys(props).reduce(function (acc, key) {
      return _extends({}, acc, _defineProperty({}, key, function () {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        var initAction = void 0;
        if (args.length === 0) {
          initAction = props[key]({}, ownProps);
        } else {
          initAction = props[key].apply(props, args.concat([ownProps]));
        }

        var action = _extends({}, initAction, {
          $meta: _extends({}, initAction.$meta || {}, $meta)
        });
        return dispatch(action);
      }));
    }, {});
  };
};