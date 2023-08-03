import { GqlAuthentication } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { DolphinDto } from './dto/dolphin.dto';

@Resolver()
@GqlAuthentication()
export class DolphinResolver {
  @Query(() => DolphinDto)
  getFlipper() {
    return new DolphinDto('Flipper');
  }
}
