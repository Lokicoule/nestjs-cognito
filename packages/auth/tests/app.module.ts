import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DolphinModule } from "./dolphin/dolphin.module";
import { MantaModule } from "./manta/manta.module";

@Module({
  imports: [AuthModule, DolphinModule, MantaModule],
})
export class AppModule {}
