import { Stage } from "./stage.model";

export class StagePayment{
  id!: number;
  stage!: Stage;
  date!: string;
  paid!: boolean;
}
