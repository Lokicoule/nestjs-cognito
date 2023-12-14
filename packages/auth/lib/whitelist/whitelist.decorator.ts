import { SetMetadata } from "@nestjs/common";

export const IS_PUBLIC_KEY = "isPublic";

export const PublicRoute = (): MethodDecorator => (target, key, descriptor) => {
  SetMetadata(IS_PUBLIC_KEY, true)(target, key, descriptor);
};
