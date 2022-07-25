import { Authentication } from "../../../lib";
import { Controller, Get } from "@nestjs/common";

@Controller("dolphin")
@Authentication()
export class DolphinController {
  @Get("flipper")
  getFlipper() {
    return {
      message: "Flipper",
    };
  }
}
