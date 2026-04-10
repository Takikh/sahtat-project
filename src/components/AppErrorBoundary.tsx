import React from "react";

type Props = {
  children: React.ReactNode;
};

type State = {
  hasError: boolean;
  message: string;
};

export class AppErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
    };
  }

  componentDidCatch(error: Error) {
    console.error("App runtime error:", error);
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background px-4 py-12 text-foreground">
        <div className="mx-auto max-w-2xl rounded-xl border border-destructive/40 bg-card p-6">
          <h1 className="font-display text-2xl font-bold text-destructive">Application Error</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Something failed while loading the app. Check environment variables and deployment logs.
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-secondary p-3 text-xs text-destructive">
            {this.state.message}
          </pre>
        </div>
      </div>
    );
  }
}
