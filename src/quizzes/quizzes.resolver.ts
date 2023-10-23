import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Question } from '../questions/models/question.model';
import { QuestionsService } from '../questions/questions.service';
import { GetQuizArgs } from './dto/get-quiz.args';
import { Quiz } from './models/quiz.model';
import { QuizzesService } from './quizzes.service';

@Resolver(of => Quiz)
export class QuizzesResolver {
    constructor(
        private quizzesService: QuizzesService,
        private questionsService: QuestionsService,
    ) {}

    @Query(returns => [Quiz], { name: 'getQuizzes' })
    async getQuizzes() {
        return this.quizzesService.findAll();
    }

    @Query(returns => Quiz, { name: 'getQuiz' })
    async getQuiz(@Args('id', { type: () => Int }) id: number) {
        return this.quizzesService.findOneById(id);
    }

    @Mutation(returns => Quiz, { name: 'createQuiz' })
    async createQuiz(@Args() args: GetQuizArgs) {
        return this.quizzesService.addQuiz(args.name, args.questions, args.answers);
    }

    @ResolveField('questions', returns => [Question])
    async getQuestions(@Parent() quiz: Quiz) {
        const { id } = quiz;
        return this.questionsService.findAll(id);
    }
}
