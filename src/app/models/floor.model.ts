import { Building } from './building.model';
import { Stage } from './stage.model';

export class Floor {
  id!:string;
  name!: string;
  building!: Building;
  stage!: Stage;
}
