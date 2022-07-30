import { Authentication, AuthorizationGuard } from "../../lib";
import { Controller, Get, UseGuards } from "@nestjs/common";

@Controller("dolphin")
@Authentication()
export class DolphinController {
  @Get("flipper")
  @UseGuards(AuthorizationGuard(["dolphin"]))
  getFlipper() {
    return {
      message: "Flipper",
    };
  }

  @Get("position")
  @UseGuards(
    AuthorizationGuard({
      prohibitedGroups: ["shark"],
    })
  )
  getPosition() {
    return {
      message: "position",
    };
  }
}
