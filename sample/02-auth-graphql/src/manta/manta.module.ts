import { Module } from '@nestjs/common';
import { MantaResolver } from './manta.resolver';

@Module({
  providers: [MantaResolver],
})
export class MantaModule {}
