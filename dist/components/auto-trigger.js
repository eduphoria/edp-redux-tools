'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutoTrigger = function (_React$Component) {
  _inherits(AutoTrigger, _React$Component);

  function AutoTrigger(props) {
    _classCallCheck(this, AutoTrigger);

    /**
     * @property {timer} timer a setTimeout timer that calls the trigger function
     */
    var _this = _possibleConstructorReturn(this, (AutoTrigger.__proto__ || Object.getPrototypeOf(AutoTrigger)).call(this, props));

    _this.timer = null;
    return _this;
  }

  _createClass(AutoTrigger, [{
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      var _this2 = this;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      /**
       * After the `debounceTime`, check the `pristine` value.
       * If it is false, call the `trigger` property.
       */
      this.timer = setTimeout(function () {
        if (!_this2.props.pristine) {
          _this2.props.trigger();
        }
      }, this.props.debounceTime);
    }

    /**
     * Make sure to clear the timeout when the view unmounts.
     * This will prevent a trigger from firing unexpectedly.
     */

  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      if (this.timer) {
        clearTimeout(this.timer);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return null;
    }
  }]);

  return AutoTrigger;
}(_react2.default.Component);

exports.default = AutoTrigger;