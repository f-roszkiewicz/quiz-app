import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Question } from 'src/questions/models/question.model';

@ObjectType({ description: 'quiz' })
export class Quiz {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field(type => [Question])
    questions: Question[];
}
