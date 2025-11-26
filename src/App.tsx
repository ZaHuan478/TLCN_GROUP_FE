import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/Approutes";
import Navbar from "./components/organisms/Navbar/Navbar";


const App: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <Navbar />
      <AppRoutes />
    </AuthProvider>
  </BrowserRouter>
);

export default App;