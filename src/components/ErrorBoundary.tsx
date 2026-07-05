import { Component, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    console.error('El Juicio de los Dioses crashed:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 9000, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: '1.2rem',
            background: '#0a0a18', color: '#e8e4d8', textAlign: 'center', padding: '2rem',
          }}
        >
          <div style={{ fontSize: '2rem' }}>⚖</div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.1rem', color: '#d4af37', letterSpacing: 2 }}>
            Algo salió mal en el Juicio
          </div>
          <div style={{ fontSize: '.85rem', maxWidth: 420, lineHeight: 1.6 }}>
            Ocurrió un error inesperado. Tu progreso ya fue guardado automáticamente:
            al recargar, podés continuar la partida desde el menú.
          </div>
          <button className="btn" onClick={() => location.reload()}>Recargar</button>
        </div>
      );
    }
    return this.props.children;
  }
}
