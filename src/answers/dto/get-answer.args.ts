import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class GetAnswerArgs {
    @Field(type => Int)
    quizId: number;

    @Field(type => [String], { nullable: 'items' })
    answers: string[];
}
