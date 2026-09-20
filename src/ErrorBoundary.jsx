import React from 'react';

// If anything in the app throws at runtime, this shows a plain, friendly
// message instead of a blank white page. Check the browser console (F12)
// for the actual error if this ever appears.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('Portfolio crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: '3rem 1.5rem',
            maxWidth: 480,
            margin: '0 auto',
            fontFamily: 'system-ui, sans-serif',
            color: '#1A1D24',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Something went wrong.</h1>
          <p style={{ color: '#5B6270', lineHeight: 1.6 }}>
            Please refresh the page. If this keeps happening, open the browser console (F12) to see the error.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}
