import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DolphinModule } from "./dolphin/dolphin.module";
import { MantaModule } from "./manta/manta.module";
import { SharkModule } from "./shark/shark.module";
import { WhaleModule } from "./whale/whale.module";

@Module({
  imports: [AuthModule, DolphinModule, MantaModule, SharkModule, WhaleModule],
})
export class AppModule {}
