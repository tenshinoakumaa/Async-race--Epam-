export interface Car {
  name: string;
  color: string;
  id: number;
}

export interface CarBody {
  name: string;
  color: string;
}
export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface CarsResponse {
  items: Car[];
  count: string;
}
export interface WinnerCar extends Winner {
  car: Car;
}

export interface WinnersResponse {
  items: WinnerCar[];
  count: string;
}

export interface NavProps {
  setSelectedComponent: (component: "garage" | "winners") => void;
}

export interface GetCarsResponse {
  (page: number): Promise<CarsResponse>;
}

export interface CreateCarResponse {
  (body: Car): Promise<Car>;
}

export interface GarageProps {
  cars: Car[] | undefined;
  currentPage: number | undefined;
  totalPages: number;
  onPageChange: (page: number) => void;
}
