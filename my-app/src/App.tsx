import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Appointments from "./pages/Appointments";
import Documents from "./pages/Documents";
import Gencare from "./pages/GeneralCare";
import Notfound from "./pages/NotFound";

// Loads the page needed 
//Uses JSX
export default function App() {
  return(
    <div>
      {/*Shows only the matching page*/}
      {/*Looks at the URL and renders only the matching page*/}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/general" element={<Gencare />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="*" element={<Notfound />} />
      </Routes>
    </div>
  );
}