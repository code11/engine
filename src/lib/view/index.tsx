import React from 'react';
import isEqual from 'lodash/isEqual';
import {
  DataPathStructure,
  BaseState,
  BaseProps,
  BaseData,
  GenericState
} from './types';
import {
  getPropsStructure,
  calculateExtraProps,
  PropsStructure
} from './props';

const PROP_REGEX = /<([a-zA-Z0-9]+)>/g;

/**
 * Return data paths either as string or ready for injecting props
 * Ordered based on their dependencies between themselves
 * @param data the data paths to be processed
 */
function getOrderedDataPaths(data: BaseData): DataPathStructure[] {
  const paths = Object.keys(data).reduce((acc, x: string) => {
    if (data[x].indexOf('/') === 0) {
      const vars: string[] = [];
      data[x].replace(PROP_REGEX, (_a: any, b: string, _c: any, _d: any) => {
        if (!vars.includes(b)) {
          vars.push(b);
        }
      });
      if (vars.length === 0) {
        acc.push({
          name: x,
          path: data[x]
        });
      } else {
        acc.push({
          name: x,
          vars,
          path: (vars, props) => {
            let isInvalid = false;
            const path = data[x].replace(
              PROP_REGEX,
              (_a: any, b: string, _c: any, _d: any) => {
                const value = vars[b] || props[b];
                if (typeof value !== 'string' || value.length === 0) {
                  isInvalid = true;
                  return;
                }
                return value;
              }
            );
            return isInvalid ? undefined : path;
          }
        });
      }
    }
    return acc;
  }, [] as DataPathStructure[]);

  const orderedPaths = paths.sort((a, b) => {
    if (b.vars && b.vars.includes(a.name)) {
      return -1;
    } else {
      return 1;
    }
  });

  return orderedPaths;
}

// FEAT: Rollback mechanism

export function view(component: {
  args: GenericState;
  defaultProps?: GenericState;
  fn: React.FunctionComponent<BaseProps>;
}): React.ComponentClass<BaseProps, BaseState> {
  const db = window.db;
  const data = component.args;
  const view = component.fn;
  const defaultProps = component.defaultProps;

  // This needs to be here to catch errors
  class Component extends React.Component<BaseState> {
    render() {
      let el = view(this.props.state);
      if (el) {
        const extraProps = calculateExtraProps(this.props, el);
        // TODO: if !extraProps just return the initial el without clonning
        return React.cloneElement(el as React.ReactElement, extraProps);
      } else {
        return null;
      }
    }
  }

  return class Wrapper extends React.Component<BaseProps, BaseState> {
    static defaultProps = {};
    propsMap: { [key: string]: string } = {};
    propsStructure: PropsStructure;
    dataMap: DataPathStructure[] = [];
    dataListeners: { [key: string]: { (): void } } = {};
    constructor(props: BaseProps) {
      super(props);
      this.propsStructure = getPropsStructure(data, props);
      this.propsMap = Object.assign(
        defaultProps || {},
        this.propsStructure.receivedProps
      );
      this.dataMap = getOrderedDataPaths(data);
      this.state = this.getState();
      this.listenOnState();
    }

    componentDidMount() {
      // console.log('Component mounted');
    }
    componentWillUnmount() {
      this.unsubscribeDataListeners();
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
      if (!isEqual(nextProps, this.props)) {
        this.propsMap = nextProps;
        this.setState(this.getState());
        // TODO: Remove this - this.setState is async!
        setTimeout(() => {
          this.listenOnState();
        });
      }
      return true;
    }

    componentDidUpdate(prevProps: BaseProps, prevState: BaseState) {
      prevProps;
      prevState;
    }
    // TODO: Figure out how to catch errors that originate from handlers
    componentDidCatch(error: Error, info: React.ErrorInfo) {
      // console.log('Error error', error, info);
    }

    static getDerivedStateFromError(e: any) {
      return {
        hasError: true,
        errorMessage: e.message
      } as BaseState;
    }

    unsubscribeDataListeners() {
      Object.keys(this.dataListeners).forEach(x => {
        this.dataListeners[x]();
      });
    }

    listenOnPath(name: string, path: string) {
      const unsubscriber = db.on(path, (x: any) => {
        this.setState({
          [name]: x
        });
        this.dataMap.forEach(y => {
          if (y.name === name) {
            return;
          }
          if (y.vars && y.vars.includes(name) && typeof y.path === 'function') {
            this.unsubscribeDataListener(y.name);
            const path = y.path(this.state, this.propsMap);
            if (path !== undefined) {
              this.listenOnPath(y.name, path);
            }
          }
        });
      });
      this.dataListeners[name] = unsubscriber;
    }

    unsubscribeDataListener(name: string) {
      if (this.dataListeners[name]) {
        this.dataListeners[name]();
        delete this.dataListeners[name];
      }
    }

    // TODO: Compute dyanmic paths that should get changed
    // when other paths are changed
    listenOnState() {
      this.unsubscribeDataListeners();
      this.dataMap.forEach(x => {
        if (typeof x.path === 'string') {
          this.listenOnPath(x.name, x.path);
        } else {
          // These should be deffered until data is available
          const path = x.path(this.state, this.propsMap);
          if (path !== undefined) {
            this.listenOnPath(x.name, path);
          }
        }
      });
    }

    getState() {
      const state: any = {
        hasError: false
      } as BaseState;
      this.propsStructure.internal.forEach(x => {
        state[x] = this.propsMap[this.propsStructure.links[x]];
      });

      this.dataMap.forEach(x => {
        if (typeof x.path === 'string') {
          state[x.name] = db.get(x.path);
        } else {
          const path = x.path(state, this.propsMap);
          if (path !== undefined) {
            state[x.name] = db.get(path);
          }
        }
      });
      return state;
    }

    render() {
      if (this.state.hasError) {
        return (
          <div className="error">
            <p>An error occured:</p>
            <div className="errorMessage">{this.state.errorMessage}</div>
          </div>
        );
      }

      const receivedProps = Object.keys(this.props).reduce(
        (acc, x) => {
          if (/^data\-/.test(x)) {
            acc.data[x] = this.props[x];
          } else if (/^aria\-/.test(x)) {
            acc.aria[x] = this.props[x];
          } else if (/^role/.test(x)) {
            acc.role = this.props[x];
          } else if (/^className/.test(x)) {
            acc.className = this.props[x];
          } else {
            if (this.propsStructure.external.includes(x)) {
              acc.props[x] = this.props[x];
            }
          }
          return acc;
        },
        {
          className: undefined,
          data: {},
          props: {},
          aria: {},
          role: undefined
        } as any
      );

      return <Component state={this.state} receivedProps={receivedProps} />;
    }
  };
}

// TODO: When creating the TS interface for a component include all the valid htmlAttributes on it

// TODO: Refactor
// TopLevel{
//   ErrorManagement,
//   propsManagement
// }

// MidLevel{
//   ChildSelection,
//   StateManagement,
//   ListenerManagement
// }

// LowLevel{
//   Rendering
// }
