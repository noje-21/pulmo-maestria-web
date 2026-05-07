import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Production: send to error tracking service
    if (import.meta.env.PROD) {
      // Placeholder for error reporting
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[50vh] flex items-center justify-center p-8">
          <div className="text-center max-w-md space-y-4">
            <AlertTriangle className="w-12 h-12 text-accent mx-auto" />
            <h2 className="text-xl font-bold text-foreground">
              Algo salió mal
            </h2>
            <p className="text-muted-foreground text-sm">
              Ocurrió un error inesperado. Puedes intentar recargar esta sección.
            </p>
            <Button onClick={this.handleRetry} variant="outline">
              Reintentar
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}