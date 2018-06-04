import React from 'react';

export default class AutoTrigger extends React.Component {
  constructor(props) {
    super(props);
    /**
     * @property {timer} timer a setTimeout timer that calls the trigger function
     */
    this.timer = null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.timer) {
      clearTimeout(this.timer);
    }
    /**
     * After the `debounceTime`, check the `pristine` value.
     * If it is false, call the `trigger` property.
     */
    this.timer = setTimeout(() => {
      if (!nextProps.pristine) {
        nextProps.trigger();
      }
    }, this.props.debounceTime);
  }
  /**
   * Make sure to clear the timeout when the view unmounts.
   * This will prevent a trigger from firing unexpectedly.
   */
  componentWillUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  render() {
    return null;
  }
}
