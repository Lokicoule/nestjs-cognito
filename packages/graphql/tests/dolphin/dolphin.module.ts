import { Module } from "@nestjs/common";
import { DolphinResolver } from "./dolphin.resolver";

@Module({
  providers: [DolphinResolver],
})
export class DolphinModule {}
