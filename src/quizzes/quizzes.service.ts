import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleAnswer } from '../questions/possibleanswer.entity';
import { QuestionEntity } from '../questions/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Repository } from 'typeorm';
import { Quiz } from './models/quiz.model';
import { QuizEntity } from './quiz.entity';
import { Question } from 'src/questions/models/question.model';

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

    async addQuiz(name: string, questions: Question[], answers: string[]) {
        if (questions.length != answers.length) {
            throw new Error('Number of questions: ' + questions.length +
                            ' does not equal to number of answers: ' + answers.length);
        }
        if (questions.length > 26) {
            throw new Error('Too much possible answers');
        }
        if (questions.length === 0) {
            throw new Error('Quiz should have at least one question');
        }

        const quiz = new QuizEntity();
        quiz.name = name;

        const addedQuiz = await this.quizRepository.save(quiz);

        const questionTypes = [
            'Single correct',
            'Multiple correct',
            'Sorting',
            'Plain text',
        ];

        for (let i = 0; i < questions.length; i++) {
            const question = new QuestionEntity();
            question.quiz = addedQuiz;
            question.question = questions[i].question;
            question.type = questionTypes[questions[i].type];
            if (question.type === 'Plain text' && questions[i].answers.length > 0) {
                throw new Error('Plain text question shouldn\'t have possible answers');
            }
            question.answer = answers[i];
            
            const addedQuestion = await this.questionRepository.save(question);

            for (let j = 0; j < questions[i].answers.length; j++) {
                const answer = new PossibleAnswer();
                answer.answer = '';
                answer.answer += String.fromCharCode(97 + j);
                answer.answer += ') ';
                answer.answer += questions[i].answers[j];
                answer.question = addedQuestion;

                this.answerRepository.save(answer);
            }
        }

        return this.transformQuiz(addedQuiz);
    }
}
