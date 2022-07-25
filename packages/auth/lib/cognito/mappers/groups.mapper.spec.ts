import { GroupsMapper } from "./groups.mapper";

describe("GroupsMapper", () => {
  describe("fromDecodedJwt", () => {
    it("should return an empty array", () => {
      expect(GroupsMapper.fromDecodedJwt({})).toEqual([]);
      expect(GroupsMapper.fromDecodedJwt(null)).toEqual([]);
      expect(GroupsMapper.fromDecodedJwt("jwt")).toEqual([]);
      expect(
        GroupsMapper.fromDecodedJwt({
          "cognito:groups": [],
        })
      ).toEqual([]);
    });

    it("should return a filled array", () => {
      expect(
        GroupsMapper.fromDecodedJwt({
          "cognito:groups": ["admin", "user"],
        })
      ).toEqual(["admin", "user"]);
    });
  });
});
