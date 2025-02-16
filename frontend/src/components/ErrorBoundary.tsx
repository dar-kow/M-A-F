import { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Unhandled error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        // Error Display Section
        <h1 data-testid="error_boundary_message">Coś poszło nie tak.</h1>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
