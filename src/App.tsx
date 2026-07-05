import { GameProvider, useGame } from './state/GameContext';
import { MenuScreen } from './components/screens/MenuScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { EventScreen } from './components/screens/EventScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { InfoScreen } from './components/screens/InfoScreen';
import { Toast } from './components/modals/Toast';

function Screens() {
  const { state } = useGame();
  switch (state.screen) {
    case 'menu': return <MenuScreen />;
    case 'intro': return <IntroScreen />;
    case 'event': return <EventScreen />;
    case 'result': return <ResultScreen />;
    case 'achievements': return <AchievementsScreen />;
    case 'info': return <InfoScreen />;
    default: return null;
  }
}

function FooterButtons() {
  const { dispatch } = useGame();
  return (
    <>
      <button className="btn btn-ghost btn-sm" onClick={() => dispatch({ type: 'GO_TO_SCREEN', screen: 'menu' })}>☰ Menú</button>
      <button className="btn btn-ghost btn-sm" onClick={() => location.reload()}>↻ Recargar</button>
    </>
  );
}

function AutosaveToast() {
  const { toastVisible } = useGame();
  return <Toast show={toastVisible} />;
}

export default function App() {
  return (
    <GameProvider>
      <div id="app">
        <div id="header">
          <div className="h-sym">⚖</div>
          <div>
            <div className="h-title">El Juicio de los Dioses</div>
            <div className="h-sub">Un juego de filosofía para decidir el destino de la humanidad</div>
          </div>
        </div>
        <div id="main">
          <Screens />
        </div>
        <div id="footer">
          <FooterButtons />
        </div>
        <AutosaveToast />
      </div>
    </GameProvider>
  );
}
