import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import GoogleHomepage from "./pages/HomePage";
import { ThemeProvider } from "styled-components";
import { theme } from "./config/theme";
import LensPage from "./components/lens/LensPage";
import LensResultsPage from "./components/lens/LensResultPage";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<GoogleHomepage />} />
        </Routes>
        <Routes>
          <Route path="/lens" element={<LensPage />} />
        </Routes>
        <Routes>
          <Route path="/lens/results" element={<LensResultsPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
