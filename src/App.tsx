import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { Map3D } from './components/Map3D';
import { DEFAULT_TERMINAL_AREA, getTerminalAreaBySlug } from './config/terminalAreas';

// Component that handles route parameter and renders Map3D
function TerminalAreaPage() {
  const { slug } = useParams<{ slug: string }>();
  const terminalArea = slug ? getTerminalAreaBySlug(slug) : null;

  // If invalid slug, redirect to default
  if (!terminalArea) {
    return <Navigate to={`/${DEFAULT_TERMINAL_AREA}`} replace />;
  }

  return <Map3D key={terminalArea.id} terminalArea={terminalArea} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default route redirects to Seattle */}
        <Route path="/" element={<Navigate to={`/${DEFAULT_TERMINAL_AREA}`} replace />} />

        {/* Dynamic route for each terminal area */}
        <Route path="/:slug" element={<TerminalAreaPage />} />

        {/* Catch-all redirects to default */}
        <Route path="*" element={<Navigate to={`/${DEFAULT_TERMINAL_AREA}`} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
