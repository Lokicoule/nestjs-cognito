import { Module } from "@nestjs/common";
import { DolphinController } from "./dolphin.controller";

@Module({
  controllers: [DolphinController],
})
export class DolphinModule {}
