import { Building } from "./building.model";
import { Floor } from "./floor.model";

export class Unit {
  id!: number;
  building!: Building;
  floor!: Floor;
  unitNumber!: string;
  area!: number;
  bedrooms!: number;
  bathrooms!: number;
  booked!: boolean;
  photoUrls!: string[];
  price!: number;
  interestRate!: number;
}
