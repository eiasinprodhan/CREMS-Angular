import { Project } from "./project.model";

export class Building {
    id!: string;
    name!: string;
    type!: string;
    project!: string;
    siteManager!: string;
    floorCount!: number;
    unitCount!: number;
    photo!:string;
}