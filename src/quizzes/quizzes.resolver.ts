import { Args, Int, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Quiz } from './models/quiz.model';
import { QuizzesService } from './quizzes.service';

@Resolver(of => Quiz)
export class QuizzesResolver {
    constructor(
        private quizzesService: QuizzesService,
        private questionsService: QuestionsService,
    ) {}

    @Query(returns => [Quiz], { name: 'quizzes' })
    async getQuizzes() {
        return this.quizzesService.findAll();
    }

    @Query(returns => Quiz, { name: 'quiz' })
    async getQuiz(@Args('id', { type: () => Int }) id: number) {
        return this.quizzesService.findOneById(id);
    }

    @ResolveField('questions', returns => [Question])
    async getQuestions(@Parent() quiz: Quiz) {
        const { id } = quiz;
        return this.questionsService.findAll(id);
    }
}
