'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Do we want to include this in edp-redux-tools?
// import InlineLoadingIndicator from './inline-loading-indicator';

/**
 * DataLoader - Wraps other components. Uses the `isLoading` prop to determine
 * whether to show a loading indicator or the wrapped components. The
 * loading indicator can be customized with the `loadingComponent` prop. Also
 * uses the `mapPropsToData` prop to fetch data needed for the component.
 *
 * @extends Component
 */
var DataLoader = function (_Component) {
  _inherits(DataLoader, _Component);

  function DataLoader(props, context) {
    _classCallCheck(this, DataLoader);

    var _this = _possibleConstructorReturn(this, (DataLoader.__proto__ || Object.getPrototypeOf(DataLoader)).call(this, props));

    _this.store = props.store || context.store;

    /**
     * @callback mapPropsToData Takes props and returns actions to dispatch
     * when the props change values.
     * @param {Object} props Props needed for mapPropsToData to fetch data.
     * @returns {Object} The object returned from mapPropsToData has a key
     * corrosponding to each prop needed to fetch data. The value for each
     * key should be an action (or array of actions) to be dispatched whenever
     * the corrosponding props changes value. An additional key `_` can be
     * defined that will be called automatically (and only once) when the
     * component mounts.
     *
     * @example ({ prop1, prop2}) => ({
     *    _: [ACTION_1, ACTION_2]
     *    prop1: ACTION_3,
     *    prop2: [ACTION_4, ACTION_5]
     *  })
     */
    _this.mapPropsToData = _this.props.mapPropsToData;

    /**
     * Default the loadingComponent to `InlineLoadingIndicator`, but allow to
     * be overrided with `loadingComponent` prop.
     */
    _this.loadingComponent = _this.props.loadingComponent || 'Loading...';

    /**
     * If mapPropsToData has been passed in, the `actionObject` is used to
     * build the initial values of each prop (`importantProps`), which is
     * set to the state for this component. This is used to track whether or
     * not values change as new props are received.
     */
    var actionObject = _this.mapPropsToData && _this.props.mapPropsToData(props) || {};

    var importantProps = Object.keys(actionObject).reduce(function (acc, key) {
      return key !== '_' ? _extends({}, acc, _defineProperty({}, key, props[key])) : acc;
    }, {});

    _this.state = importantProps;

    /**
     * Go ahead and trigger any actions if there's an available value for
     * the related prop.
     */
    Object.keys(importantProps).forEach(function (key) {
      return _this.state[key] && _this.triggerAction(actionObject[key]);
    });

    /**
     * And trigger any actions for the `_` if it's been defined.
     */
    if (actionObject._) {
      _this.triggerAction(actionObject._);
    }
    return _this;
  }

  _createClass(DataLoader, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var _this2 = this;

      /**
       * For each prop in the state, check if the new value for the prop is
       * different than the value currently in state. If so, trigger the action
       * for that prop from `mapPropsToData`.
       */
      Object.keys(this.state).forEach(function (key) {
        if (_this2.state[key] !== nextProps[key] && nextProps[key]) {
          _this2.setState(_defineProperty({}, key, nextProps[key]));
          if (_this2.mapPropsToData) {
            _this2.triggerAction(_this2.mapPropsToData(nextProps)[key]);
          }
        }
      });
    }
  }, {
    key: 'triggerAction',
    value: function triggerAction(action) {
      var _this3 = this;

      /**
       * Dispatch any action from `mapPropsToData`. If `action` is an array,
       * dispatch each action in the array.
       */
      if (action) {
        if (Array.isArray(action)) {
          action.forEach(function (actionItem) {
            return actionItem && _this3.store.dispatch(actionItem);
          });
        } else {
          this.store.dispatch(action);
        }
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return this.props.isLoading ? this.loadingComponent : this.props.children;
    }
  }]);

  return DataLoader;
}(_react.Component);

DataLoader.contextTypes = { store: _propTypes2.default.object };

exports.default = DataLoader;