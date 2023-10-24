import { Injectable } from '@nestjs/common';
import { QuestionsService } from '../questions/questions.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { Answer } from './models/answer.model';

@Injectable()
export class AnswersService {
    constructor(
        private questionsService: QuestionsService,
        private quizzesService: QuizzesService,
    ) {}

    async answer(quizId: number, answers: string[]) {
        const quiz = await this.quizzesService.findOneEntity(quizId);
        const questions = await this.questionsService.findEntities({
            where: {
                quiz: quiz,
            },
        });
        if (questions.length !== answers.length) {
            throw new Error('Incorrect number of answers, expected: ' + questions.length +
                            ', actual: ' + answers.length);
        }

        const questionOptions = await this.questionsService.findOptionEntities({
            where: {
                question: {
                    quiz: {
                        id: quizId,
                    },
                },
            },
            relations: {
                question: true,
            },
        });

        console.log(questionOptions[0]);

        const retAnswers = [] as Answer[];
        for (let i = 0; i < questions.length; i++) {
            const options = [];
            for (let j = 0; j < questionOptions.length; j++) {
                if (questionOptions[j].question.id === questions[i].id) {
                    options.push(questionOptions[j]);
                }
            }
            const answer = new Answer();
            answer.yourAnswer = answers[i];
            if (options.length === 0) {
                answer.correctAnswer = questions[i].plainTextAnswer;
            } else if (questions[i].type == 'Sorting') {
                options.sort((a, b) => {
                    return a.correct - b.correct;
                });
                answer.correctAnswer = '';
                options.forEach((op) => {
                    answer.correctAnswer += op.id;
                    answer.correctAnswer += ',';
                });
                answer.correctAnswer = answer.correctAnswer.slice(0, -1);
            } else {
                options.sort((a, b) => {
                    return a.id - b.id;
                });
                answer.correctAnswer = '';
                options.forEach((op) => {
                    if (op.correct === 1) {
                        answer.correctAnswer += op.id;
                        answer.correctAnswer += ',';
                    }
                });
                answer.correctAnswer = answer.correctAnswer.slice(0, -1);
            }
            answer.correct = answer.yourAnswer === answer.correctAnswer;
            retAnswers.push(answer);
        }

        return retAnswers;
    }
}
