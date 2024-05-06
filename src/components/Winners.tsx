import { useEffect, useState } from "react";
import { WinnerCar } from "../types/types";
import getWinners from "../api/getWinners";
import { WINNERS_LIMIT } from "../api/variables";
import CarSVG from "./CarSVG";

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerCar[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const { items, count } = await getWinners({
          pageNumber: currentPage,
          sort: "wins",
          order: "desc",
        });
        setWinners(items);
        const totalCount = Number(count);
        setTotalPages(Math.ceil(totalCount / WINNERS_LIMIT));
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };

    fetchWinners();
  }, [currentPage]);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="bg-white flex flex-col items-center pt-14 space-y-28">
      <ul className="max-w-6xl mx-auto space-y-10">
        {winners.map((winner) => (
          <li
            key={winner.id}
            className="flex justify-between items-center w-full"
            style={{ borderTop: "2px solid #000" }}
          >
            <CarSVG
              left="10rem"
              carBody={{
                name: winner.car.name,
                color: winner.car.color,
              }}
            />
            <div className="absolute" style={{ left: "15rem" }}>
              <span>
                Car id - {winner.id} - {winner.car.name} - Wins: {winner.wins} -
                Time: {winner.time}
              </span>
            </div>
          </li>
        ))}
      </ul>
      <div>
        <button disabled={currentPage === 1} onClick={goToPreviousPage}>
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button disabled={currentPage === totalPages} onClick={goToNextPage}>
          Next
        </button>
      </div>
    </div>
  );
};

export default Winners;
