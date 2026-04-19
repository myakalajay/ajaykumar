/**
 * @file main.tsx
 * @description Application Entry Point & Global Error Boundary
 * * ARCHITECTURAL NOTES:
 * 1. Defensive Programming: Implemented a global ErrorBoundary to catch React render tree crashes.
 * Prevents the "White Screen of Death" and maintains brand integrity during fatal errors.
 * 2. StrictMode: Kept active to ensure React 18+ concurrent rendering safety.
 * 3. Theme Sync: Fallback UI precisely aligned with the global Neon Lime (#bef264) & Deep Black aesthetic.
 */

import React, { Component, ErrorInfo, ReactNode, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { Terminal, AlertTriangle } from 'lucide-react';

// ============================================================================
// GLOBAL ERROR BOUNDARY
// Prevents the entire React tree from unmounting on a child component crash.
// ============================================================================
interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // In a real enterprise app, this routes to Sentry, Datadog, or LogRocket.
    console.error("Uncaught Runtime Exception:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Sleek, branded fallback UI mapping to the Neon Lime/Black design tokens
      return (
        <div className="min-h-screen bg-[#000000] text-white flex flex-col items-center justify-center p-6 selection:bg-[#bef264] selection:text-black">
          <div className="max-w-2xl w-full bg-white/[0.02] border border-white/10 p-12 rounded-sm shadow-2xl relative overflow-hidden">
            
            {/* Top Accent Bar */}
            <div className="absolute top-0 left-0 w-full h-1 bg-[#bef264]" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-[#bef264]/10 rounded-sm border border-[#bef264]/20">
                <AlertTriangle className="w-8 h-8 text-[#bef264]" />
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold tracking-tight">System Exception</h1>
                <p className="text-xs font-mono text-white/50 uppercase tracking-widest mt-1">Runtime Render Failure</p>
              </div>
            </div>
            
            <p className="text-white/70 leading-relaxed mb-8 font-light font-sans">
              The application encountered an unexpected architectural fault. The UI tree has been safely halted to prevent data corruption.
            </p>
            
            {/* Code Output Block */}
            <div className="bg-[#0a0a0a] p-4 rounded-sm border border-white/5 mb-8 overflow-x-auto">
              <code className="text-[10px] text-[#bef264] font-mono whitespace-pre-wrap">
                {this.state.error?.toString() || "Unknown rendering error occurred."}
              </code>
            </div>
            
            {/* Action Button */}
            <button 
              onClick={() => window.location.reload()} 
              className="flex items-center gap-3 bg-[#bef264] text-black px-8 py-4 text-xs uppercase tracking-widest font-bold hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 rounded-sm shadow-[0_0_20px_rgba(190,242,100,0.2)]"
            >
              <Terminal className="w-4 h-4" /> Reboot System
            </button>
            
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// ============================================================================
// REACT DOM BOOTSTRAP
// ============================================================================
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Ensure there is a <div id='root'></div> in your index.html.");
}

createRoot(rootElement).render(
  <StrictMode>
    <GlobalErrorBoundary>
      <App />
    </GlobalErrorBoundary>
  </StrictMode>
);