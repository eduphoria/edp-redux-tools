import { Component } from 'react';
import PropTypes from 'prop-types';

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
class DataLoader extends Component {
  constructor(props, context) {
    super(props);
    this.store = props.store || context.store;

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
    this.mapPropsToData = this.props.mapPropsToData;

    /**
     * Default the loadingComponent to `InlineLoadingIndicator`, but allow to
     * be overrided with `loadingComponent` prop.
     */
    this.loadingComponent = this.props.loadingComponent || 'Loading...';

    /**
     * If mapPropsToData has been passed in, the `actionObject` is used to
     * build the initial values of each prop (`importantProps`), which is
     * set to the state for this component. This is used to track whether or
     * not values change as new props are received.
     */
    const actionObject =
      (this.mapPropsToData && this.props.mapPropsToData(props)) || {};

    const importantProps = Object.keys(actionObject).reduce(
      (acc, key) => (key !== '_' ? { ...acc, [key]: props[key] } : acc),
      {}
    );

    this.state = importantProps;

    /**
     * Go ahead and trigger any actions if there's an available value for
     * the related prop.
     */
    Object.keys(importantProps).forEach(
      key => this.state[key] && this.triggerAction(actionObject[key])
    );

    /**
     * And trigger any actions for the `_` if it's been defined.
     */
    if (actionObject._) {
      this.triggerAction(actionObject._);
    }
  }

  componentWillReceiveProps(nextProps) {
    /**
     * For each prop in the state, check if the new value for the prop is
     * different than the value currently in state. If so, trigger the action
     * for that prop from `mapPropsToData`.
     */
    Object.keys(this.state).forEach(key => {
      if (this.state[key] !== nextProps[key] && nextProps[key]) {
        this.setState({ [key]: nextProps[key] });
        if (this.mapPropsToData) {
          this.triggerAction(this.mapPropsToData(nextProps)[key]);
        }
      }
    });
  }

  triggerAction(action) {
    /**
     * Dispatch any action from `mapPropsToData`. If `action` is an array,
     * dispatch each action in the array.
     */
    if (action) {
      if (Array.isArray(action)) {
        action.forEach(
          actionItem => actionItem && this.store.dispatch(actionItem)
        );
      } else {
        this.store.dispatch(action);
      }
    }
  }

  render() {
    return this.props.isLoading ? this.loadingComponent : this.props.children;
  }
}
DataLoader.contextTypes = { store: PropTypes.object };

export default DataLoader;
