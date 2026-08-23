import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
import AdminPasswords from "./pages/AdminPasswords";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AboutDeveloper from "./pages/AboutDeveloper";

import { ThemeProvider, useTheme } from "./context/ThemeContext";

function AppRoutes() {
  const { theme } = useTheme();

  const isLight = theme === "light";

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/admin/passwords" element={<AdminPasswords />} />

      <Route path="/about" element={<AboutDeveloper isLight={isLight} />} />

      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <Chat />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
