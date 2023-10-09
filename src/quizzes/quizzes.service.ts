import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleAnswer } from '../questions/possibleanswer.entity';
import { QuestionEntity } from '../questions/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Repository } from 'typeorm';
import { GetQuizArgs } from './dto/get-quiz.args';
import { Quiz } from './models/quiz.model';
import { QuizEntity } from './quiz.entity';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(QuizEntity)
        private quizRepository: Repository<QuizEntity>,
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(PossibleAnswer)
        private answerRepository: Repository<PossibleAnswer>,
        private questionsService: QuestionsService,
    ) {}

    private async transformQuiz(quiz: QuizEntity) {
        const retQuiz = new Quiz();
        retQuiz.id = quiz.id;
        retQuiz.name = quiz.name;
        const questions = await this.questionsService.findEntities({
            where: {
                quiz: quiz,
            },
        });
        retQuiz.questions = await this.questionsService.transformQuestions(questions);
        return retQuiz;
    }

    async findAll() {
        const quizzes = await this.quizRepository.find();
        const retQuizzes = [] as Quiz[];
        for (let i = 0; i < quizzes.length; i++) {
            const retQuiz = await this.transformQuiz(quizzes[i]);
            retQuizzes.push(retQuiz);
        }
        return retQuizzes;
    }
    
    async findOneById(id: number) {
        const quiz = await this.quizRepository.findOneById(id);
        return this.transformQuiz(quiz);
    }

    async findOneEntity(id: number) {
        return this.quizRepository.findOneById(id);
    }

    async addQuiz(args: GetQuizArgs) {
        if (args.questions.length != args.answers.length) {
            throw new Error('Number of questions: ' + args.questions.length +
                            ' does not equal to number of answers: ' + args.answers.length);
        }
        if (args.questions.length > 26) {
            throw new Error('Too much possible answers');
        }
        if (args.questions.length === 0) {
            throw new Error('Quiz should have at least one question');
        }

        const quiz = new QuizEntity();
        quiz.name = args.name;

        const addedQuiz = await this.quizRepository.save(quiz);

        for (let i = 0; i < args.questions.length; i++) {
            const question = new QuestionEntity();
            question.quiz = addedQuiz;
            question.question = args.questions[i].question;
            if (args.questions[i].type == 0) {
                question.type = 'Single correct';
            } else if (args.questions[i].type == 1) {
                question.type = 'Multiple correct';
            } else if (args.questions[i].type == 2) {
                question.type = 'Sorting';
            } else if (args.questions[i].type == 3) {
                question.type = 'Plain text';
                if (args.questions[i].answers.length > 0) {
                    throw new Error('Plain text question shouldn\'t have possible answers');
                }
            }
            question.answer = args.answers[i];
            
            const addedQuestion = await this.questionRepository.save(question);

            for (let j = 0; j < args.questions[i].answers.length; j++) {
                const answer = new PossibleAnswer();
                answer.answer = '';
                answer.answer += String.fromCharCode(97 + j);
                answer.answer += ') ';
                answer.answer += args.questions[i].answers[j];
                answer.question = addedQuestion;

                this.answerRepository.save(answer);
            }
        }

        return this.transformQuiz(addedQuiz);
    }
}
