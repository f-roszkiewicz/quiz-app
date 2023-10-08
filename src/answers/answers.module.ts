import { Module } from '@nestjs/common';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';

@Module({
    providers: [AnswersResolver, AnswersService],
})
export class AnswersModule {}
