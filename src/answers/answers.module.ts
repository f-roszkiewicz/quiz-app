import { Module } from '@nestjs/common';
import { QuestionsModule } from 'src/questions/questions.module';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';

@Module({
    imports: [QuestionsModule],
    providers: [AnswersResolver, AnswersService],
})
export class AnswersModule {}
