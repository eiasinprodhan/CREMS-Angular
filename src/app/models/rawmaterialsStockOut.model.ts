import { RawMaterials } from "./rawmaterial.model";
import { Stage } from "./stage.model";

export class RawMaterialsStockOut {
  id?: number;
  stage!: Stage;
  rawMaterial!: RawMaterials;
  name!: string;
  date!: Date;
  quantity!: number;
  unit!: string;
}
