import * as React from "react";
import { Car, CarBody, GarageProps } from "../types/types";
import createCar from "../api/createCar";
import carModels from "../carName&Models/carModels";
import carNames from "../carName&Models/carNames";

const Garage: React.FC<GarageProps & { fetchData: (page: number) => void }> = ({
  cars,
  currentPage,
  totalPages,
  onPageChange,
  fetchData,
}) => {
  const generateAndCreateCars = async () => {
    const generateRandomColor = () => {
      const letters = "0123456789ABCDEF";
      let color = "#";
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    };

    const generateRandomCarName = () => {
      const randomModel =
        carModels[Math.floor(Math.random() * carModels.length)];
      const randomName = carNames[Math.floor(Math.random() * carNames.length)];
      return `${randomName} ${randomModel}`;
    };

    for (let i = 0; i < 100; i++) {
      const randomColor = generateRandomColor();
      const randomName = generateRandomCarName();
      const newCar: CarBody = {
        name: randomName,
        color: randomColor,
      };

      try {
        const res: Car = await createCar(newCar);
        console.log("Car created successfully: " + res);
        await fetchData(Number(currentPage));
      } catch (error) {
        console.error("Error creating car:", error);
      }
    }
  };

  const goToPreviousPage = () => {
    if (currentPage !== undefined && currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage !== undefined && currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto">
        <ul>
          {cars &&
            cars.map((car) => (
              <li style={{ background: car.color }} key={car.id}>
                {car.name}
              </li>
            ))}
        </ul>
        <div>
          <button onClick={generateAndCreateCars}>Generate Cars</button>
          <button onClick={goToPreviousPage}>Previous Page</button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button onClick={goToNextPage}>Next Page</button>
        </div>
      </div>
    </div>
  );
};

export default Garage;
