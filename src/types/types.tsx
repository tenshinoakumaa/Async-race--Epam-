type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;

export type Color = RGB | RGBA | HEX;

export interface Car {
  name: string;
  color: Color;
  id: number;
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
