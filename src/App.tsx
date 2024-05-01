import { useEffect, useState } from "react";
import Nav from "./components/Nav";
import Garage from "./components/Garage";
import getCars from "./api/getCars";
import { Car } from "./types/types";
import { CSSProperties } from "react";

const ContainerStyles: CSSProperties = {
  background: "#110000",
};

export default function App() {
  const [selectedComponent, setSelectedComponent] = useState<
    "garage" | "winners"
  >("garage");
  const [cars, setCars] = useState<Car[] | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState<number | undefined>(1); // Updated to accept undefined
  const [totalPages, setTotalPages] = useState<number>(1);

  const fetchData = async (page: number) => {
    try {
      const { items, count } = await getCars(page);
      setCars(items);
      setTotalPages(Math.ceil(Number(count) / 7));
      setCurrentPage(page);
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(() => page);
    fetchData(page);
  };

  return (
    <>
      <div style={ContainerStyles}>
        <Nav setSelectedComponent={setSelectedComponent} />
        {selectedComponent === "garage" ? (
          <Garage
            cars={cars}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            fetchData={fetchData}
          />
        ) : (
          ""
        )}
      </div>
    </>
  );
}
