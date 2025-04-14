// components/ErrorBoundary.jsx
import React, { Component } from "react";

class ErrorBoundary extends Component {
  state = {
    hasError: false,
  };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center text-red-500 dark:text-red-400 p-4">
          Đã xảy ra lỗi. Vui lòng thử lại sau.
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;