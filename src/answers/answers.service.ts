import { Injectable } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { GetAnswerArgs } from './dto/get-answer.args';
import { Answer } from './models/answer.model';

@Injectable()
export class AnswersService {
    constructor(
        private questionsService: QuestionsService,
        private quizzesService: QuizzesService,
    ) {}

    async answer(args: GetAnswerArgs) {
        const quiz = await this.quizzesService.findOneEntity(args.quizId);
        const questions = await this.questionsService.findEntities({
            where: {
                quiz: quiz,
            },
        });
        if (questions.length != args.answers.length) {
            throw new Error('Incorrect number of answers, expected: ' + questions.length +
                            ', actual: ' + args.answers.length);
        }

        const answers = [] as Answer[];
        for (let i = 0; i < questions.length; i++) {
            const answer = new Answer();
            answer.yourAnswer = args.answers[i];
            answer.correctAnswer = questions[i].answer;
            answers.push(answer);
        }

        return answers;
    }
}
