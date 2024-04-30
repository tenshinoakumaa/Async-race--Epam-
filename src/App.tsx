import Nav from "./components/Nav";
import Garage from "./components/Garage";

import getCars from "./api/getCars";

import { Car } from "./types/types";

import { CSSProperties, useEffect, useState } from "react";

const ContainerStyles: CSSProperties = {
  background: "#110000",
};

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<
    "garage" | "winners"
  >("garage");

  const [cars, setCars] = useState<Car[] | undefined>(undefined);

  const fetchData = async (page: number) => {
    try {
      const { items } = await getCars(page);
      setCars(items);
      console.log(items);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchData(0);
  }, []);

  return (
    <>
      <div style={ContainerStyles}>
        <Nav setSelectedComponent={setSelectedComponent} />
        {selectedComponent === "garage" ? <Garage cars={cars} /> : ""}
      </div>
    </>
  );
}
