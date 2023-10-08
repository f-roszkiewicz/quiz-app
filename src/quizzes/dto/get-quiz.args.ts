import { ArgsType, Field } from '@nestjs/graphql';
import { Question } from 'src/questions/models/question.model';

@ArgsType()
export class GetQuizArgs {
    @Field()
    name: string;

    @Field(type => [Question])
    questions: Question[];

    @Field(type => [String])
    answers: string[];
}
