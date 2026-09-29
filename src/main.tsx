import React, { Component, ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { AlertTriangle, RotateCcw } from "lucide-react";
import App from "./App";
import "./index.css";

class GlobalErrorBoundary extends Component<{ children?: ReactNode }, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: any) { console.error("Portfolio render error", error, info); }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main style={{minHeight:"100vh",background:"#f5f5f2",display:"grid",placeItems:"center",padding:24,fontFamily:"Geist Variable,system-ui,sans-serif",color:"#111210"}}>
        <section style={{maxWidth:680,width:"100%",background:"#fff",border:"1px solid #d9dbd4",borderRadius:24,padding:36,boxShadow:"0 30px 90px rgba(17,18,16,.1)"}}>
          <div style={{width:48,height:48,borderRadius:14,display:"grid",placeItems:"center",background:"#f0eee8",marginBottom:20}}><AlertTriangle/></div>
          <div style={{fontSize:10,letterSpacing:".15em",textTransform:"uppercase",color:"#777a72"}}>Portfolio runtime safeguard</div>
          <h1 style={{fontSize:40,lineHeight:1,letterSpacing:"-.05em",margin:"10px 0 14px"}}>The interface hit an unexpected error.</h1>
          <p style={{color:"#6f726a",lineHeight:1.6}}>Reload first. If it happens again, open the browser console and share the first red error rather than changing random project files.</p>
          <pre style={{background:"#f7f7f4",color:"#5f2024",padding:16,borderRadius:14,overflow:"auto",fontSize:11}}>{this.state.error?.message || "Unknown error"}</pre>
          <button onClick={()=>window.location.reload()} style={{marginTop:18,height:46,padding:"0 18px",border:0,borderRadius:12,background:"#ed1c24",color:"#fff",fontWeight:700,display:"inline-flex",alignItems:"center",gap:8}}><RotateCcw size={15}/> Reload portfolio</button>
        </section>
      </main>
    );
  }
}

createRoot(document.getElementById("root")!).render(<React.StrictMode><GlobalErrorBoundary><App /></GlobalErrorBoundary></React.StrictMode>);
