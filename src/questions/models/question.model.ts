import { Field, InputType, Int, ObjectType, registerEnumType } from '@nestjs/graphql';

export enum QuestionType {
    SINGLE_CORRECT,
    MULTIPLE_CORRECT,
    SORTING,
    PLAIN_TEXT,
}

registerEnumType(QuestionType, {
    name: 'QuestionType',
});

@ObjectType({ description: 'question' })
@InputType('question')
export class Question {
    @Field()
    question: string;

    @Field(type => QuestionType)
    type: QuestionType;

    @Field(type => [Int], { nullable: true })
    answerIds?: number[];

    @Field(type => [String], { nullable: true })
    answerOptions?: string[];
}
