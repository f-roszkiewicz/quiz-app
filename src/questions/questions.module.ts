import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/question.model';
import { PossibleAnswer } from './possibleanswer.entity';
import { QuestionEntity } from './question.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionEntity, PossibleAnswer])],
    providers: [QuestionsResolver, QuestionsService, Question],
    exports: [QuestionsService, Question, TypeOrmModule],
})
export class QuestionsModule {}
