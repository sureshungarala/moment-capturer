import React from 'react';

import Banner from './Banner';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error('Failed to load page route ', error);
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) return <Banner canRefresh />;

    return this.props.children;
  }
}
export default ErrorBoundary;
