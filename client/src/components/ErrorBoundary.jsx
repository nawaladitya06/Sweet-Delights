import React from 'react';
import Header from './Header';
import Footer from './Footer';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans">
                    <Header />
                    <main className="flex-grow flex flex-col items-center justify-center p-6 text-center">
                        <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mb-6 border border-accent/20">
                            <span className="material-symbols-outlined text-5xl text-accent animate-bounce">warning</span>
                        </div>
                        <h1 className="text-4xl font-serif font-black text-accent mb-4">Something went wrong</h1>
                        <p className="text-lg text-text-muted max-w-md mx-auto mb-8">
                            We've encountered a technical glitch. Don't worry, our bakers are working on it!
                        </p>
                        <button
                            onClick={() => window.location.href = '/home'}
                            className="btn-primary py-3 px-8 rounded-full font-bold shadow-lg hover:shadow-accent/40 bg-accent text-white"
                        >
                            Return Home
                        </button>
                    </main>
                    <Footer />
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
