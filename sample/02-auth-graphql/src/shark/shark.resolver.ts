import { AuthenticationGuard } from '@nestjs-cognito/graphql';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { SharkDto } from './dto/shark.dto';

@Resolver()
export class SharkResolver {
  @Query(() => SharkDto)
  @UseGuards(AuthenticationGuard)
  getBlue() {
    return new SharkDto('Blue');
  }
}
