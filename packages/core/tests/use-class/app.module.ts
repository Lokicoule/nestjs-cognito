import { Module } from "@nestjs/common";
import { CognitoModule } from "../../lib/cognito.module";
import { AppController } from "../common/app.controller";
import { AppService } from "../common/app.service";
import { CognitoConfigService } from "./cognito.config.service";

@Module({
  controllers: [AppController],
  imports: [
    CognitoModule.registerAsync({
      useClass: CognitoConfigService,
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
