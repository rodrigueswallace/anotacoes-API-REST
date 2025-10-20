import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  componentName?: string
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error(`ErrorBoundary: erro em ${this.props.componentName || 'componente'}`, error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className="p-4 border border-light-black/20 rounded-md bg-main-white">
          <p className="text-second-dark font-semibold mb-1">Ocorreu um erro ao carregar este conteúdo.</p>
          <p className="text-second-black text-sm">Tente atualizar a página ou voltar e abrir novamente.</p>
        </div>
      )
    }
    return this.props.children
  }
}
