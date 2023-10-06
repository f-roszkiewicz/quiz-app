import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'quiz' })
export class Quiz {
    @Field(type => Int)
    id: number;

    @Field()
    name: string;

    @Field(type => [Question])
    questions: Question[];
}
