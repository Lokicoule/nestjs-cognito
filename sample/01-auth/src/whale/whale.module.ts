import { Module } from '@nestjs/common';
import { WhaleController } from './whale.controller';

@Module({
  controllers: [WhaleController],
})
export class WhaleModule {}
