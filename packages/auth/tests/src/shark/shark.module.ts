import { Module } from "@nestjs/common";
import { SharkController } from "./shark.controller";

@Module({
  controllers: [SharkController],
})
export class SharkModule {}
