//@ts-nocheck
import * as React from "react";
import { CSSProperties } from "react";
import { HexColorPicker } from "react-colorful";
import { useState, useEffect } from "react";
import CarSVG from "./CarSVG";

import { Car, CarBody, GarageProps, Winner } from "../types/types";
import carModels from "../carName&Models/carModels";
import carNames from "../carName&Models/carNames";

import createCar from "../api/createCar";
import updateCar from "../api/updateCar";
import deleteCar from "../api/deleteCar";
import getEngine from "../api/getEngine";
import deleteWinner from "../api/deleteWinner";
import updateWinner from "../api/updateWinner";
import drive from "../api/drive";
import createWinner from "../api/createWinner";
import getWinner from "../api/getWinner";

import finishLine from "../img/finish-line.png";

const Garage: React.FC<GarageProps & { fetchData: (page: number) => void }> = ({
  cars,
  currentPage,
  totalPages,
  onPageChange,
  fetchData,
  count,
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
        await deleteWinner(selectedCar?.id);
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
      setCarsVelocity([...Array(cars.length).fill(0)]);
      setCarsPosition([...Array(cars.length).fill(0)]);
    }
  }, [cars]);
  const [carsPosition, setCarsPosition] = useState<number[]>(
    Array(cars?.length).fill(0)
  );

  async function checkStatus(id: number) {
    const success = await drive(id);
    if (success) {
      clearInterval(intervals[id]);
    }
  }

  const StartRaceForOneCar = async (car: Car) => {
    if (!raceInProgress) {
      setRaceInProgress(true);
      setCarInRace(car.id);
      const newCarsVelocity = carsVelocity;
      if (newCarsVelocity) {
        const res = await getEngine(car.id, "started");
        newCarsVelocity[(car.id - 1) % 7] = res.velocity;
        setCarsVelocity(newCarsVelocity);
        const velocity =
          (86 /
            (500000 /
              ((carsVelocity && carsVelocity[(car.id - 1) % 7]) || 0))) *
          5;
        const newIntervals = intervals;
        const startTime = new Date();
        newIntervals[(car.id - 1) % 7] = setInterval(async () => {
          const currentTime = new Date();
          const timeElapsed = (Number(currentTime) - Number(startTime)) / 1000;
          const newPositions = carsPosition;
          newPositions[(car.id - 1) % 7] += velocity;
          setCarsPosition(() => [...newPositions]);
          if (carsPosition && carsPosition[(car.id - 1) % 7] >= 86) {
            clearInterval(intervals[(car.id - 1) % 7]);
            alert(car.name + " and time : " + timeElapsed);
            setResetButtonDisabled(false);
          }
        }, 1);
        setIntervals(newIntervals);
        if (res) checkStatus(car.id);
      }
    }
  };

  const [raceInProgress, setRaceInProgress] = useState(false);
  const [carInRace, setCarInRace] = useState<number | null>(null);

  const StartRace = async () => {
    setRaceInProgress(true);
    const promises = cars?.map(async (car) => {
      await getEngine(car.id, "stopped");
    }) as Promise<void>[];
    await Promise.all(promises);
    setCarsVelocity(() => [0, 0, 0, 0, 0, 0, 0]);
    setCarsPosition(() => [0, 0, 0, 0, 0, 0, 0]);
    let winner: Winner | null = null;
    const newCarsVelocity = carsVelocity;
    if (newCarsVelocity) {
      setRaceStarted(true);
      cars?.map(async (car) => {
        const res = await getEngine(car.id, "started");
        newCarsVelocity[(car.id - 1) % 7] = res.velocity;
        setCarsVelocity(newCarsVelocity);
        const velocity = (86 / (500000 /((carsVelocity && carsVelocity[(car.id - 1) % 7]) || 0))) *5;
        const newIntervals = intervals;
        const startTime = new Date();
        newIntervals[(car.id - 1) % 7] = setInterval(async () => {
          const currentTime = new Date();
          const timeElapsed = (Number(currentTime) - Number(startTime)) / 1000;
          const newPositions = carsPosition;
          newPositions[(car.id - 1) % 7] += velocity;
          setCarsPosition(() => [...newPositions]);
          if (carsPosition[(car.id - 1) % 7] >= 86) {
            clearInterval(intervals[(car.id - 1) % 7]);
            if (winner === null) {
              const newWinner = {
                id: car.id,
                wins: 1,
                time: timeElapsed,
              };
              winner = newWinner;
              try {
                await createWinner(winner);
                alert("Winner : " + car.name + " and time : " + timeElapsed);
              } catch {
                const res = await getWinner(winner.id);
                const updatedWinner = res;
                updatedWinner.time = Math.max(updatedWinner.time, timeElapsed);
                updatedWinner.wins += 1;
                await updateWinner(updatedWinner);
                alert("Winner : " + car.name + " and time : " + timeElapsed);
              }}}}, 1);
        setIntervals(newIntervals);
        if (res) checkStatus(car.id);
      });
    }
  };

  const [raceStarted, setRaceStarted] = useState(false);
  const [resetButtonDisabled, setResetButtonDisabled] = useState(true);
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (raceStarted) {
      timer = setTimeout(() => {
        setResetButtonDisabled(false);
      }, 2000);
    }
    return () => clearTimeout(timer);
  }, [raceStarted]);

  const handleReset = async () => {
    setRaceInProgress(false);
    setCarInRace(null);
    setResetButtonDisabled(true);
    cars?.map(async (car) => {
      await getEngine(car.id, "stopped");
    });
    setRaceStarted(false);
    cars?.map((car) => {
      clearInterval(intervals[(car.id - 1) % 7]);
    });
    setCarsVelocity(() => [0, 0, 0, 0, 0, 0, 0]);
    setCarsPosition(() => [0, 0, 0, 0, 0, 0, 0]);
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

  useEffect(() => {
    setCarsVelocity(Array(cars?.length).fill(0));
    setCarsPosition(Array(cars?.length).fill(0));
  }, [currentPage]);

  const [color, setColor] = useState("#ffffff");
  const [name, setName] = useState("");

  const [selectedCar, setSelectedCar] = useState<Car>();
  const [intervals, setIntervals] = useState<NodeJS.Timeout[]>([]);

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
            disabled={raceStarted}
            style={{
              background: raceStarted ? "#343B29" : "",
            }}
          >
            Start race
          </button>
          <button
            onClick={handleReset}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
            disabled={resetButtonDisabled}
            style={{
              background: resetButtonDisabled ? "#480607" : "",
            }}
          >
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
                  // visibility: car.id == cars.length ? "hidden" : "visible",
                }}
                key={car.id}
                className="flex items-center justify-center py-4 rounded-xl"
              >
                <button
                  onClick={() => StartRaceForOneCar(car)}
                  disabled={raceInProgress}
                  className="mr-4 p-2 bg-black text-white rounded-xl"
                  style={{
                    background: raceInProgress ? "gray" : "",
                  }}
                >
                  Start
                </button>
                <img
                  src={finishLine}
                  className="w-14"
                  alt=""
                  style={FinishLine}
                />
                <CarSVG
                  carBody={car}
                  left={`${carsPosition[(car.id - 1) % 7]}%`}
                />
                <div className="text-center text-md font-bold mr-4">
                  {car.name}
                </div>
                <button
                  onClick={handleReset}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl"
                  disabled={car.id !== carInRace}
                  style={{
                    background: car.id !== carInRace ? "#480607" : "",
                  }}
                >
                  Stop
                </button>
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
        <div className="w-full text-center text-2xl pb-4">
          Total count of cars : {count}
        </div>
      </div>
    </div>
  );
};

export default Garage;
