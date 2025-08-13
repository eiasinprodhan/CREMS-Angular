import { Project } from "./project.model";

export class Building {
    id!: number;
    name!: string;
    type!: string;
    project!: number;
    siteManager!: number;
    floorCount!: number;
    unitCount!: number;
    photo!:string;
}