import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import GoogleHomepage from "./pages/HomePage";
import { ThemeProvider } from "styled-components";
import { theme } from "./config/theme";
import GoogleLens from "./pages/Lens";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<GoogleHomepage />} />
        </Routes>
        <Routes>
          <Route path="/lens" element={<GoogleLens />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
