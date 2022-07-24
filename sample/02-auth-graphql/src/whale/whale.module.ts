import { Module } from '@nestjs/common';
import { WhaleResolver } from './whale.resolver';

@Module({
  providers: [WhaleResolver],
})
export class WhaleModule {}
