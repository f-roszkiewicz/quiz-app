import { Injectable } from '@nestjs/common';
import { QuestionsService } from 'src/questions/questions.service';
import { GetAnswerArgs } from './dto/get-answer.args';
import { Answer } from './models/answer.model';

@Injectable()
export class AnswersService {
    constructor(
        private questionsService: QuestionsService,
    ) {}

    async answer(args: GetAnswerArgs) {
        const questions = await this.questionsService.findEntities({
            where: {
                id: args.quizId,
            },
        });
        if (questions.length != args.answers.length) {
            throw "Incorrect number of answers";
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
