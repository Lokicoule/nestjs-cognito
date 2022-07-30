import { Query, Resolver } from "@nestjs/graphql";
import { Authorization } from "../../lib";
import { Response } from "../common/response.dto";

@Resolver(() => Response)
@Authorization({
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
