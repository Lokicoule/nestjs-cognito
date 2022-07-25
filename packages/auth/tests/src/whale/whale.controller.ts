import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "../../../lib";

@Controller("whale")
export class WhaleController {
  @Get("moby")
  @UseGuards(AuthorizationGuard(["admin", "whale"]))
  getMoby() {
    return {
      message: "Moby",
    };
  }
}
