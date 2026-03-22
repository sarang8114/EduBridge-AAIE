import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import Sidebar   from "./components/Sidebar";
import Home      from "./pages/Home";
import Feedback  from "./pages/Feedback";
import About     from "./pages/About";
import Settings  from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="flex min-h-screen" style={{ background: "var(--bg-primary)", color: "var(--text-primary)" }}>
          <Sidebar />
          <div className="flex-1 ml-16">
            <Routes>
              <Route path="/"         element={<Home />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/about"    element={<About />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;