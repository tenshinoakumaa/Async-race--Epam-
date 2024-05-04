import * as React from "react";
import { Car, CarBody, GarageProps } from "../types/types";
import createCar from "../api/createCar";
import updateCar from "../api/updateCar";
import deleteCar from "../api/deleteCar";
import getEngine from "../api/getEngine";
import carModels from "../carName&Models/carModels";
import carNames from "../carName&Models/carNames";
import CarSVG from "./CarSVG";
import { CSSProperties } from "react";
import finishLine from "../img/finish-line.png";
import { useState, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

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

  const CreateCar = async () => {
    const newCar: CarBody = {
      name: name,
      color: color,
    };

    try {
      const res: Car = await createCar(newCar);
      console.log("Car created successfully: " + res);
      await fetchData(Number(currentPage));
    } catch (error) {
      console.error("Error creating car:", error);
    }
  };

  const UpdateCar = async () => {
    const newCar: CarBody = {
      name: name,
      color: color,
    };
    if (selectedCar != undefined) {
      try {
        const res: Car = await updateCar(selectedCar?.id, newCar);
        console.log("Car updated successfully: " + res);
        await fetchData(Number(currentPage));
      } catch (error) {
        console.error("Error updating car:", error);
      }
    }
  };

  const DeleteCar = async () => {
    if (selectedCar != undefined) {
      try {
        await deleteCar(selectedCar?.id);
        console.log("Car deleted successfully");
        await fetchData(Number(currentPage));
      } catch (error) {
        console.error("Error deleting car:", error);
      }
    }
  };

  const [carsVelocity, setCarsVelocity] = useState<number[]>([]);
  useEffect(() => {
    if (cars) {
      setCarsVelocity(Array(cars.length).fill(0));
    }
  }, [cars]);
  const [carsPosition, setCarsPosition] = useState<number[]>(
    Array(cars?.length).fill(0)
  );

  useEffect(() => {
    if (cars) {
      setCarsPosition(Array(cars.length).fill(0));
    }
  }, [cars]);

  const StartRace = async () => {
    const newCarsVelocity = carsVelocity;
    if (newCarsVelocity) {
      cars?.map(async (car) => {
        const res = await getEngine(car.id, "started");
        newCarsVelocity[car.id] = res.velocity;
        setCarsVelocity(newCarsVelocity);
        const velocity = (86 / (500000 / carsVelocity[car.id])) * 5;
        // console.log(car.name + "'s velocity : " + carsVelocity[car.id]);
        // console.log(car.name + "'s velocity : " + velocity);
        const interval = setInterval(() => {
          const newPositions = carsPosition;
          newPositions[car.id] += velocity;
          setCarsPosition(() => [...newPositions]);
          if (carsPosition[car.id] >= 86) {
            clearInterval(interval);
            console.log("Завершено");
          }
          console.log(carsPosition[car.id]);
        }, 1);
      });
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

  const FinishLine: CSSProperties = {
    position: "absolute",
    left: "86%",
    zIndex: "0",
  };

  const [color, setColor] = useState("#ffffff");
  const [name, setName] = useState("");

  const [selectedCar, setSelectedCar] = useState<Car>();

  return (
    <div className="bg-white">
      <div className="max-w-6xl px-4 mx-auto">
        <div className="flex justify-between items-center pt-7 max-w-5xl mx-auto">
          <button
            onClick={generateAndCreateCars}
            className="bg-yellow-500 text-white px-4 py-2 rounded-xl"
          >
            Generate Cars
          </button>
          <div className="bg-black w-1 h-12 rounded-full"></div>
          <div className="flex flex-col space-y-4 xl:flex-row xl:space-y-0 items-center justify-between space-x-0 xl:space-x-8">
            <input
              className="px-4 py-2 bg-black rounded-xl text-white"
              type="text"
              onChange={(event) => setName(event.target.value)}
              placeholder="car name"
            />
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-xl"
              onClick={CreateCar}
            >
              Create car
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-xl"
              onClick={UpdateCar}
            >
              Update car
            </button>

            <button
              className="bg-red-500 text-white px-4 py-2 rounded-xl"
              onClick={DeleteCar}
            >
              Delete car
            </button>
            <HexColorPicker color={color} onChange={setColor} />
          </div>
        </div>
        <div className="mx-auto py-6 flex justify-between items-center max-w-sm">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-xl"
            onClick={StartRace}
          >
            Start race
          </button>
          <button className="bg-red-500 text-white px-4 py-2 rounded-xl">
            Reset race
          </button>
        </div>
        <ul className="space-y-4 pt-4 relative">
          {cars &&
            cars.map((car) => (
              <li
                onClick={() => {
                  selectedCar == car
                    ? setSelectedCar(undefined)
                    : setSelectedCar(car);
                  console.log(car);
                }}
                style={{
                  borderBottom: "1px solid #000",
                  background: selectedCar?.id == car.id ? "gray" : "",
                  visibility: car.id == cars.length ? "hidden" : "visible",
                }}
                key={car.id}
                className="flex items-center justify-center py-4 rounded-xl"
              >
                <img
                  src={finishLine}
                  className="w-14"
                  alt=""
                  style={FinishLine}
                />
                <CarSVG carBody={car} left={`${carsPosition[car.id]}%`} />
                <div className="text-center text-md font-bold">{car.name}</div>
              </li>
            ))}
        </ul>
        <div className="flex justify-between items-center py-7 max-w-xl mx-auto">
          <button
            className="bg-black text-white px-4 py-2 rounded-xl"
            onClick={goToPreviousPage}
          >
            Previous Page
          </button>
          <span className="text-xl font-bold">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="bg-black text-white px-4 py-2 rounded-xl"
            onClick={goToNextPage}
          >
            Next Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default Garage;
function forceUpdate() {
  throw new Error("Function not implemented.");
}
