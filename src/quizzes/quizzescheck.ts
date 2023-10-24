import { Question } from '../questions/models/question.model';

export class QuizzesCheck {
    static checkQuizInput(name: string, questions: Question[], answers: string[]) {
        if (questions.length !== answers.length) {
            throw new Error('Number of questions: ' + questions.length +
                            ' does not equal to number of answers: ' + answers.length);
        }
        if (questions.length === 0) {
            throw new Error('Quiz should have at least one question');
        }
        for (let i = 0; i < questions.length; i++) {
            if (questions[i].type === 3) {
                if (questions[i].answerOptions.length > 0) {
                    throw new Error('Plain text question shouldn\'t have possible answers');
                }
            } else {
                for (let j = 0; j < answers[i].length; j++) {
                    if ((answers[i].charCodeAt(j) < '0'.charCodeAt(0) ||
                        answers[i].charCodeAt(j) > '9'.charCodeAt(0)) &&
                        answers[i].charCodeAt(j) !== ','.charCodeAt(0)) {
                        throw new Error('Answers should be a list of numbers');
                    }
                }
            }
            const tmpAnswers = answers[i].split(',');
            if (questions[i].type === 0 && tmpAnswers.length !== 1) {
                throw new Error('More than one answer in single answer question');
            }
            if (questions[i].type !== 3 && tmpAnswers.length > questions[i].answerOptions.length) {
                throw new Error('Too much answers compared to question options');
            }
        }
    }
}
