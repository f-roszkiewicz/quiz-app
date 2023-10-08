import { Module } from '@nestjs/common';
import { QuestionsModule } from 'src/questions/questions.module';
import { QuizzesModule } from 'src/quizzes/quizzes.module';
import { AnswersResolver } from './answers.resolver';
import { AnswersService } from './answers.service';

@Module({
    imports: [QuestionsModule, QuizzesModule],
    providers: [AnswersResolver, AnswersService],
})
export class AnswersModule {}
