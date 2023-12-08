import { Authorization } from "../../lib";
import { Controller, Get } from "@nestjs/common";

@Controller("manta")
export class MantaController {
  @Get("ray")
  @Authorization({
    requiredGroups: ["manta"],
    prohibitedGroups: ["dolphin", "shark", "whale"],
  })
  getRay() {
    return {
      message: "Ray",
    };
  }
}
