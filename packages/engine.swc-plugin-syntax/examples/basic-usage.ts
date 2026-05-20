// Example of using view and producer annotations

// View component with observation
const Counter: view = ({ count = observe.count }) => {
  return <div>Count: {count}</div>;
};

// Producer function with update
const incrementCount: producer = ({ count = update.count }) => {
  count(prev => prev + 1);
};

// Multiple declarations
const resetCount: producer = ({ count = update.count }) => {
  count(0);
};

// Empty arguments
const EmptyView: view = () => {
  return <div>Empty View</div>;
};

// Props passthrough
const PropsView: view = (props) => {
  return <div {...props}>Props View</div>;
};