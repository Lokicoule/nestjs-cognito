import { Module } from '@nestjs/common';
import { SharkResolver } from './shark.resolver';

@Module({
  providers: [SharkResolver],
})
export class SharkModule {}
