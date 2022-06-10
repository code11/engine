import React from "react";

export class ErrorBoundary extends React.Component<
  any,
  {
    error: Error | null;
    parentViewId: string;
  }
> {
  constructor(props: any) {
    super(props);
    this.state = { error: null, parentViewId: props.viewId };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <DefaultError
          error={this.state.error}
          viewId={this.state.parentViewId}
        />
      );
    }
    return this.props.children;
  }
}

export const DevelopmentErrorFallback: React.FC<{
  error: Error;
  viewId: string;
}> = ({ error, viewId }) => (
  <div
    style={{ backgroundColor: "rgb(241,156,187)" }}
    data-testid="error"
    data-viewid={viewId}
  >
    Error: {error && error.message}
  </div>
);

export const ProductionErrorFallback: React.FC = () => (
  <div style={{ backgroundColor: "rgb(241,156,187)" }}>
    The section could not be shown
  </div>
);

export const DefaultError: React.FC<{
  error: Error;
  viewId: string;
}> = ({ error, viewId }) => {
  if (process.env.NODE_ENV === "production") {
    return <ProductionErrorFallback />;
  } else {
    return <DevelopmentErrorFallback error={error} viewId={viewId} />;
  }
};
