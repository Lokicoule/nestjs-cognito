import { Query, Resolver } from "@nestjs/graphql";
import { GqlAuthorization } from "../../lib";
import { Response } from "../common/response.dto";

@Resolver(() => Response)
@GqlAuthorization({
  requiredGroups: ["manta"],
  prohibitedGroups: ["dolphin", "shark", "whale"],
})
export class MantaResolver {
  @Query(() => Response)
  getRay(): Response {
    return {
      message: "Ray",
    };
  }
}
