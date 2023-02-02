import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { DolphinModule } from "./dolphin/dolphin.module";
import { MantaModule } from "./manta/manta.module";
import { JwtModule } from "@nestjs/jwt";
@Module({
  imports: [AuthModule, DolphinModule, MantaModule, JwtModule.register({})],
})
export class AppModule {}
