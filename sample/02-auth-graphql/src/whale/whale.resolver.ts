import { AuthorizationGuard } from '@nestjs-cognito/graphql';
import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';
import { WhaleDto } from './dto/whale.dto';

@Resolver()
export class WhaleResolver {
  @Query(() => WhaleDto)
  @UseGuards(AuthorizationGuard(['admin', 'whale']))
  getMoby() {
    return new WhaleDto('Moby');
  }
}
