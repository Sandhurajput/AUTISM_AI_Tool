import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import ErrorBoundary from "./components/ErrorBoundary";
import AutismScreeningForm from "./components/AutismScreeningForm";
import ScreeningResults from "./components/ScreeningResults";
import ResultsPage from './components/ResultsPage'; 
import "./App.css";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AutismScreeningForm />} />
            <Route path="/results" element={<ScreeningResults />} />
            <Route path="/pdf-report" element={<ResultsPage />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;