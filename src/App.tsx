import { useState } from 'react';
import { GameProvider, useGame } from './state/GameContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import { SplashScreen } from './components/SplashScreen';
import { MenuScreen } from './components/screens/MenuScreen';
import { IntroScreen } from './components/screens/IntroScreen';
import { EventScreen } from './components/screens/EventScreen';
import { ResultScreen } from './components/screens/ResultScreen';
import { AchievementsScreen } from './components/screens/AchievementsScreen';
import { InfoScreen } from './components/screens/InfoScreen';
import { ReviewScreen } from './components/screens/ReviewScreen';
import { Toast } from './components/modals/Toast';
import { TooltipBox } from './components/ui/TooltipBox';
import { MuteToggle } from './components/ui/MuteToggle';

function CurrentScreen() {
  const { state } = useGame();
  switch (state.screen) {
    case 'menu': return <MenuScreen />;
    case 'intro': return <IntroScreen />;
    case 'event': return <EventScreen />;
    case 'result': return <ResultScreen />;
    case 'achievements': return <AchievementsScreen />;
    case 'info': return <InfoScreen />;
    case 'review': return <ReviewScreen />;
    default: return null;
  }
}

// Remounting on screen change (via key) replays the fade-up animation,
// giving every screen transition a soft crossfade instead of an abrupt cut.
function Screens() {
  const { state } = useGame();
  return (
    <div key={state.screen} className="screen-transition fade-up">
      <CurrentScreen />
    </div>
  );
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
  const { toast } = useGame();
  return <Toast show={toast.visible} text={toast.text} />;
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <ErrorBoundary>
        <SplashScreen onDone={() => setShowSplash(false)} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
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
          <TooltipBox />
          <MuteToggle />
        </div>
      </GameProvider>
    </ErrorBoundary>
  );
}
