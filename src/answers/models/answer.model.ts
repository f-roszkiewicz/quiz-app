import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'answer' })
export class Answer {
    @Field({ nullable: true })
    yourAnswer?: string;

    @Field()
    correctAnswer: string;

    @Field(type => Boolean)
    correct: boolean;
}
