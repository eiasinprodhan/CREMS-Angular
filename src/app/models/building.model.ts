import { Employee } from "./employee.model";
import { Project } from "./project.model";

export class Building {
    id!: number;
    name!: string;
    type!: string;
    location!:string;
    project!: Project;
    siteManager!: Employee;
    floorCount!: number;
    unitCount!: number;
    photo!:string;
}