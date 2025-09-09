import { Floor } from "./floor.model";

export class Stage {
  id!: number;
  name!: string;
  startDate!: Date;
  endDate!: Date;
  floor!: Floor;
  labours!: number[];
}
