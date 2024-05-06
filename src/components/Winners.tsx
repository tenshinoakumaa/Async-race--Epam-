import { useEffect, useState } from "react";
import { WinnerCar } from "../types/types";
import getWinners from "../api/getWinners";
import { WINNERS_LIMIT } from "../api/variables";
import CarSVG from "./CarSVG";

const Winners: React.FC = () => {
  const [winners, setWinners] = useState<WinnerCar[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [sort, setSort] = useState<"id" | "wins" | "time">("id");
  const [order, setOrder] = useState<"ASC" | "DESC">("ASC");
  const [totalWinners, setTotalWinners] = useState<string>("0");

  useEffect(() => {
    const fetchWinners = async (
      sort: "id" | "wins" | "time",
      order: "DESC" | "ASC"
    ) => {
      try {
        const { items, count } = await getWinners({
          pageNumber: currentPage,
          sort,
          order,
        });
        setTotalWinners(count);
        setWinners(items);
        const totalCount = Number(count);
        setTotalPages(Math.ceil(totalCount / WINNERS_LIMIT));
      } catch (error) {
        console.error("Error fetching winners:", error);
      }
    };
    fetchWinners(sort, order);
  }, [currentPage, sort, order]);

  const goToPreviousPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const goToNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleSortChange = (
    newSort: "id" | "wins" | "time",
    newOrder: "DESC" | "ASC"
  ) => {
    setSort(newSort);
    setOrder(newOrder);
    console.log("Sorting by " + sort + " and " + order);
  };

  return (
    <div className="bg-white flex flex-col items-center pt-14 space-y-14">
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
      <div className="flex space-x-4 items-center">
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          disabled={currentPage === 1}
          onClick={goToPreviousPage}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          disabled={currentPage === totalPages}
          onClick={goToNextPage}
        >
          Next
        </button>
      </div>
      <div className="w-full text-center text-2xl pb-4">
        Total count of cars : {totalWinners}
      </div>

      <div className="flex flex-col items-center space-y-4 pb-7">
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          onClick={() => handleSortChange("wins", "DESC")}
        >
          Sort by Wins (Desc)
        </button>
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          onClick={() => handleSortChange("wins", "ASC")}
        >
          Sort by Wins (Asc)
        </button>
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          onClick={() => handleSortChange("time", "DESC")}
        >
          Sort by Time (Desc)
        </button>
        <button
          className="text-xl p-2 bg-black text-white rounded-xl"
          onClick={() => handleSortChange("time", "ASC")}
        >
          Sort by Time (Asc)
        </button>
      </div>
    </div>
  );
};

export default Winners;
