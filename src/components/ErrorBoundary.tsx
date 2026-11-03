import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

interface ReactAppErrorReport {
  type: "buildify:app:error";
  name: string;
  message: string;
  stack?: string;
  componentStack: string;
  timestamp: string;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): {
    hasError: boolean;
    error: Error;
  } {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.setState({ errorInfo });

    try {
      const errorMessage: ReactAppErrorReport = {
        type: "buildify:app:error",
        name: error.name,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
      };

      if (window.parent !== window) {
        window.parent.postMessage(errorMessage, "*");
        console.log("Error report sent");
      }
    } catch (reportingError) {
      console.error("Failed to report error to parent window:", reportingError);
    }
  }

  triggerErrorOverlay(err) {
    const ErrorOverlay = customElements.get("vite-error-overlay");

    if (ErrorOverlay) {
      const overlay = document.querySelector(
        "vite-error-overlay"
      ) as HTMLElement & { err: Error };
      if (overlay) {
        overlay.err = err;
      } else {
        const overlay = new ErrorOverlay(err);
        document.body.appendChild(overlay);
      }
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#070B1F] p-6 text-center text-slate-100">
          <p className="text-lg font-semibold">Nexus-premium hit a problem</p>
          <p className="max-w-md break-words text-sm text-slate-400">
            {this.state.error?.message ?? "Unknown error"}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-xl bg-gradient-to-r from-[#3DD5FF] to-[#A855F7] px-5 py-2.5 text-sm font-semibold text-[#070B1F]"
          >
            Reload
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
