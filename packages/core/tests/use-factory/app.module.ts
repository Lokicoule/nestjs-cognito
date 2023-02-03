import { Module } from "@nestjs/common";
import { CognitoModule } from "../../lib/cognito.module";
import { AppController } from "../common/app.controller";
import { AppService } from "../common/app.service";

@Module({
  controllers: [AppController],
  imports: [
    CognitoModule.registerAsync({
      useFactory: () => ({
        jwtVerifier: {
          userPoolId: "us-east-1_123456789",
        },
      }),
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
