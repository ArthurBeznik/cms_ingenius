import { BaseEntity } from "./base";
import { Module } from "./module";

export interface Course extends BaseEntity {
  description: string;
  modules: Module[];
  modulesId: number[];
}
