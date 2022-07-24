import { Authentication } from '@nestjs-cognito/graphql';
import { Query, Resolver } from '@nestjs/graphql';
import { DolphinDto } from './dto/dolphin.dto';

@Resolver()
@Authentication()
export class DolphinResolver {
  @Query(() => DolphinDto)
  getFlipper() {
    return new DolphinDto('Flipper');
  }
}
