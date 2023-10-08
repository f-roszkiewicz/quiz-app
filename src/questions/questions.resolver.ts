import { Resolver } from '@nestjs/graphql';
import { Question } from './models/question.model';

@Resolver(of => Question)
export class QuestionsResolver {}
