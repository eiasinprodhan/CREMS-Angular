import { Building } from "./building.model";

export class Floor {
  id!: number;
  name!: string;
  building!: Building;
  expectedEndDate!: Date;
}
