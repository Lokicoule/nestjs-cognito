import { Query, Resolver } from "@nestjs/graphql";
import { GqlAuthorization } from "../../lib";
import { Response } from "../common/response.dto";

@Resolver(() => Response)
export class MantaResolver {
  @GqlAuthorization({
    requiredGroups: ["manta"],
    prohibitedGroups: ["dolphin", "shark", "whale"],
  })
  @Query(() => Response)
  getRay(): Response {
    return {
      message: "Ray",
    };
  }
}
