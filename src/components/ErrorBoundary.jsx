import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console in development
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          border: '1px solid red', 
          borderRadius: '5px', 
          margin: '20px',
          backgroundColor: '#ffebee'
        }}>
          <h2>🚨 Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>Error Details (click to expand)</summary>
            <div style={{ marginTop: '10px', fontFamily: 'monospace', fontSize: '12px' }}>
              <strong>Error:</strong> {this.state.error && this.state.error.toString()}
              <br />
              <strong>Stack:</strong> {this.state.errorInfo.componentStack}
            </div>
          </details>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '15px', 
              padding: '10px 20px', 
              backgroundColor: '#2196F3', 
              color: 'white', 
              border: 'none', 
              borderRadius: '5px' 
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;