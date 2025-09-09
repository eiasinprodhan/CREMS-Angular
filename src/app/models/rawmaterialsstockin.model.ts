import { RawMaterials } from "./rawmaterial.model";

export class RawMaterialsStockIn {
    id!: number;
    rawMaterial!:RawMaterials;
    name!: string;
    date!:Date;
    quantity!: number;
    unit!:string;
    unitPrice!:number;
    supplier!:string;
    totalPrice!:number;
}