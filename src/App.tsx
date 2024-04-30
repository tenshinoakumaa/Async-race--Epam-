import Nav from "./components/Nav";
import Garage from "./components/Garage";
import NotFound from "./components/NotFound";

import { CSSProperties } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const ContainerStyles: CSSProperties = {
  background: "#110000",
};

export default function App() {
  return (
    <>
      <div style={ContainerStyles}>
        <Nav />
        <Routes>
          <Route path="/" element={<Garage />} />
          <Route path="/Garage" element={<Garage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </>
  );
}
