import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionsModule } from '../questions/questions.module';
import { QuizEntity } from './quiz.entity';
import { QuizzesResolver } from './quizzes.resolver';
import { QuizzesService } from './quizzes.service';

@Module({
    imports: [QuestionsModule, TypeOrmModule.forFeature([QuizEntity])],
    providers: [QuizzesService, QuizzesResolver],
    exports: [QuizzesService, TypeOrmModule],
})
export class QuizzesModule {}
