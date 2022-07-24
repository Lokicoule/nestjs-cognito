import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AuthModule } from './auth/auth.module';
import { DolphinModule } from './dolphin/dolphin.module';
import { MantaModule } from './manta/manta.module';
import { SharkModule } from './shark/shark.module';
import { WhaleModule } from './whale/whale.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      playground: true,
    }),
    AuthModule,
    DolphinModule,
    MantaModule,
    SharkModule,
    WhaleModule,
  ],
})
export class AppModule {}
