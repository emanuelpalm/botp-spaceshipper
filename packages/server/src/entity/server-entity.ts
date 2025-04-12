import { DataEntity } from "@spaceshipper/common";

export interface ServerEntity {
  data: DataEntity;

  update(dt: number): void;
}