import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { QuestionOption } from '../questions/questionoption.entity';
import { QuestionEntity } from '../questions/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { DataSource, Repository } from 'typeorm';
import { Quiz } from './models/quiz.model';
import { QuizEntity } from './quiz.entity';
import { Question } from 'src/questions/models/question.model';
import { QuizzesCheck } from './quizzescheck';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(QuizEntity)
        private quizRepository: Repository<QuizEntity>,
        private dataSource: DataSource,
        private questionsService: QuestionsService,
    ) {}

    private async transformQuiz(quiz: QuizEntity) {
        const retQuiz = new Quiz();
        retQuiz.id = quiz.id;
        retQuiz.name = quiz.name;
        retQuiz.questions = await this.questionsService.findAll(quiz.id);
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
        QuizzesCheck.checkQuizInput(name, questions, answers);

        const querryRunner = this.dataSource.createQueryRunner();
        await querryRunner.connect();
        await querryRunner.startTransaction();

        const quiz = new QuizEntity();
        quiz.name = name;

        const addedQuiz = await querryRunner.manager.save(quiz);

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
            if (question.type === 'Plain text') {
                question.plainTextAnswer = answers[i];
            }

            const addedQuestion = await querryRunner.manager.save(question);

            const correctAnswers = answers[i].split(',').map(i => Number(i));
            for (let j = 0; j < questions[i].answerOptions.length; j++) {
                const qOption = new QuestionOption();
                qOption.option = questions[i].answerOptions[j];
                qOption.question = addedQuestion;

                if (question.type === 'Sorting') {
                    const position = correctAnswers.indexOf(j + 1);
                    qOption.correct = position;
                } else if (correctAnswers.includes(j + 1)) {
                    qOption.correct = 1;
                }

                querryRunner.manager.save(qOption);
            }
        }

        await querryRunner.commitTransaction();
        await querryRunner.release();

        return this.transformQuiz(addedQuiz);
    }
}
