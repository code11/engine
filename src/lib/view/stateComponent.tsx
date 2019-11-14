import React from 'react';
import isEqual from 'lodash/isEqual';
import { BaseState, BaseProps, DataPathStructure } from './types';
import { PropsStructure, getPropsStructure } from './getPropsStructure';
import { RenderComponent } from './renderComponent';
import { getOrderedDataPaths } from './getOrderedDataPaths';

/**
 * - Builds up the state
 * - Creates listeners to react to state changes
 * - Gives the state to the renderComponent
 * - Chooses in which view-state/variant the component needs to be in
 * - Mounts and unmounts children states accordingly
 */
export function stateComponent(
  db: any,
  args: any,
  view: any,
  defaultProps: any
) {
  // TODO: Move props logic to PropsComponent
  return class StateComponent extends React.Component<BaseProps, BaseState> {
    static defaultProps = {};
    propsMap: { [key: string]: string } = {};
    propsStructure: PropsStructure;
    dataMap: DataPathStructure[] = [];
    dataListeners: { [key: string]: { (): void } } = {};
    constructor(props: BaseProps) {
      super(props);
      this.propsStructure = getPropsStructure(args, props);
      this.propsMap = Object.assign(
        defaultProps || {},
        this.propsStructure.receivedProps
      );
      this.dataMap = getOrderedDataPaths(args);
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
      console.error(error);
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

      return (
        <RenderComponent
          fn={view}
          propsStructure={this.propsStructure}
          state={this.state}
          rProps={this.props}
        />
      );
    }
  };
}
