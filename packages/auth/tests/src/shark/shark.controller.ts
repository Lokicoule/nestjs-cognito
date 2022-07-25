import { AuthenticationGuard } from "../../../lib";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("shark")
export class SharkController {
  @Get("blue")
  @UseGuards(AuthenticationGuard)
  getBlue() {
    return {
      message: "Blue",
    };
  }
}
