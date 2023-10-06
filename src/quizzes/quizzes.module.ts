import { Module } from '@nestjs/common';
import { Quiz } from './models/quiz.model';
import { QuizzesResolver } from './quizzes.resolver';
import { QuizzesService } from './quizzes.service';

@Module({
    imports: [QuestionsModule],
    providers: [QuizzesService, QuizzesResolver, Quiz],
})
export class QuizzesModule {}
