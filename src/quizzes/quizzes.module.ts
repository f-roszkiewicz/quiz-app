import { Module } from '@nestjs/common';
import { QuestionsModule } from '../questions/questions.module';
import { QuizzesResolver } from './quizzes.resolver';
import { QuizzesService } from './quizzes.service';

@Module({
    imports: [QuestionsModule],
    providers: [QuizzesService, QuizzesResolver],
    exports: [QuizzesService],
})
export class QuizzesModule {}
