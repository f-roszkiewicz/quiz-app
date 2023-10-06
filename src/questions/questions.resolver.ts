import { Resolver } from '@nestjs/graphql';
import { Question } from './models/questions.model';

@Resolver(of => Question)
export class QuestionsResolver {}
