import { UseGuards } from "@nestjs/common";
import { Query, Resolver } from "@nestjs/graphql";
import { Authentication, AuthorizationGuard } from "../../lib";
import { Response } from "../common/response.dto";

@Resolver(() => Response)
@Authentication()
export class DolphinResolver {
  @Query(() => Response)
  @UseGuards(AuthorizationGuard(["dolphin"]))
  getFlipper(): Response {
    return {
      message: "Flipper",
    };
  }

  @Query(() => Response)
  @UseGuards(
    AuthorizationGuard({
      prohibitedGroups: ["shark"],
    })
  )
  getPosition(): Response {
    return {
      message: "position",
    };
  }
}
