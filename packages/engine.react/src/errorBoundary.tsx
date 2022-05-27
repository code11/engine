import React from "react";

interface SampleState {
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<any, SampleState> {
  constructor(props: any) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return <DefaultError error={this.state.error} />;
    }
    return this.props.children;
  }
}

export const DefaultError: React.FC<{ error?: Error }> = ({ error }) => {
  if (process.env.NODE_ENV == "production") {
    return (
      <div style={{ backgroundColor: "rgb(241,156,187)" }}>
        The section could not be shown
      </div>
    );
  }
  return (
    <div style={{ backgroundColor: "rgb(241,156,187)" }} data-testid="error">
      Error: {error && error.message}
    </div>
  );
};
