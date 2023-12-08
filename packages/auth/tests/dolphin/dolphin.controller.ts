import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthorizationGuard } from "../../lib";

@Controller("dolphin")
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
    }),
  )
  getPosition() {
    return {
      message: "position",
    };
  }
}
