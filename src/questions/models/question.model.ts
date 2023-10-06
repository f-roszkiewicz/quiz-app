import { Field, ObjectType, registerEnumType } from '@nestjs/graphql';

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
export class Question {
    @Field()
    question: string;

    @Field(type => QuestionType)
    type: QuestionType;

    @Field({ nullable: true })
    answers?: string;
}
