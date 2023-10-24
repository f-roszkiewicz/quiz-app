import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Question } from './models/question.model';
import { QuestionOption } from './questionoption.entity';
import { QuestionEntity } from './question.entity';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionEntity, QuestionOption])],
    providers: [QuestionsResolver, QuestionsService, Question],
    exports: [QuestionsService, Question, TypeOrmModule],
})
export class QuestionsModule {}
