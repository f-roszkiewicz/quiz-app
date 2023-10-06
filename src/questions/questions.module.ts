import { Module } from '@nestjs/common';
import { Question } from './models/questions.model';
import { QuestionsResolver } from './questions.resolver';
import { QuestionsService } from './questions.service';

@Module({
    providers: [QuestionsResolver, QuestionsService, Question],
    exports: [QuestionsService, Question],
})
export class QuestionsModule {}
