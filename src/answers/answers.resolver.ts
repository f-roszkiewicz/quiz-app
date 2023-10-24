import { Args, Query, Resolver } from '@nestjs/graphql';
import { AnswersService } from './answers.service';
import { GetAnswerArgs } from './dto/get-answer.args';
import { Answer } from './models/answer.model';

@Resolver(of => Answer)
export class AnswersResolver {
    constructor(
        private answersService: AnswersService,
    ) {}

    @Query(returns => [Answer], { name: 'answer' })
    async answer(@Args() args: GetAnswerArgs) {
        return this.answersService.answer(args.quizId, args.answers);
    }
}
