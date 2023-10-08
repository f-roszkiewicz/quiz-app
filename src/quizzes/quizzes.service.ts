import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PossibleAnswer } from 'src/questions/possibleanswer.entity';
import { QuestionEntity } from 'src/questions/question.entity';
import { QuestionsService } from 'src/questions/questions.service';
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
        retQuiz.questions = await this.questionsService.transformQuestions(quiz.questions);
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

    async addQuiz(args: GetQuizArgs) {
        if (args.questions.length != args.answers.length) {
            throw "Number of questions does not equal to number of answers";
        }

        const quiz = new QuizEntity();
        quiz.name = args.name;

        const addedQuiz = await this.quizRepository.save(quiz);

        const questionType = {
            SINGLE_CORRECT: 'Single correct',
            MULTIPLE_CORRECT: 'Multiple correct',
            SORTING: 'Sorting',
            PLAIN_TEXT: 'Plain text',
        };
        for (let i = 0; i < args.questions.length; i++) {
            const question = new QuestionEntity();
            question.quiz = addedQuiz;
            question.question = args.questions[i].question;
            question.type = questionType[args.questions[i].type];
            question.answer = args.answers[i];
            
            const addedQuestion = await this.questionRepository.save(question);

            args.questions[i].answers.forEach((a) => {
                const answer = new PossibleAnswer();
                answer.answer = a;
                answer.question = addedQuestion;

                this.answerRepository.save(answer);
            });
        }

        return this.transformQuiz(addedQuiz);
    }
}
