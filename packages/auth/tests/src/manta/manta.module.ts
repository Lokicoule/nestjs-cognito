import { Module } from "@nestjs/common";
import { MantaController } from "./manta.controller";

@Module({
  controllers: [MantaController],
})
export class MantaModule {}
