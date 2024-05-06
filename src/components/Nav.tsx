import { useState } from "react";
import logo from "../img/logo.jpg";

import { NavProps } from "../types/types";

export default function Nav({ setSelectedComponent }: NavProps) {
  const [selectedPage, setSelectedPage] = useState("garage");
  const handleClickGarage = () => {
    setSelectedComponent("garage");
    setSelectedPage("garage");
  };

  const handleClickWinners = () => {
    setSelectedComponent("winners");
    setSelectedPage("winners");
  };

  return (
    <nav className="flex items-center justify-between px-8 xl:px-0 max-w-6xl mx-auto py-4">
      <img src={logo} className="w-20" alt="" />
      <ul className="flex space-x-12 text-white text-xl">
        <li
          className="cursor-pointer"
          style={{ color: selectedPage === "garage" ? "gray" : "" }}
          onClick={handleClickGarage}
        >
          Garage
        </li>
        <li
          className="cursor-pointer"
          style={{ color: selectedPage !== "garage" ? "gray" : "" }}
          onClick={handleClickWinners}
        >
          Winners
        </li>
      </ul>
    </nav>
  );
}
