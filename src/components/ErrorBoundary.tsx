import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { RefreshCcw, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F7F5F2] flex flex-col items-center justify-center p-6 text-center space-y-6">
          <div className="h-24 w-24 bg-red-100 rounded-full flex items-center justify-center mb-2">
            <AlertCircle size={48} className="text-red-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-[#2D2A26]">Ups, ada yang salah</h1>
            <p className="text-[#7A746E]">
              Terjadi kesalahan tak terduga. Kami memohon maaf atas ketidaknyamanan ini.
            </p>
          </div>
          <Button 
            onClick={() => {
              this.setState({ hasError: false });
              window.location.href = '/';
            }}
            className="rounded-xl h-12 px-8 flex items-center gap-2"
          >
            <RefreshCcw size={18} />
            Muat Ulang Aplikasi
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
