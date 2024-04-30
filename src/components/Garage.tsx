import { Car } from "../types/types";
export default function Garage({ cars }: { cars: Car[] | undefined }) {
  return (
    <div className="bg-white">
      <div className="max-w-6xl mx-auto">
        {cars && cars.map((car) => <li key={car.id}>{car.name}</li>)}
      </div>
    </div>
  );
}
