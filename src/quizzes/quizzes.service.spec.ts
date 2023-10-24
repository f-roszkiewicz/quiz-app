import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionOption } from '../questions/questionoption.entity';
import { QuestionEntity } from '../questions/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Repository } from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { QuizzesService } from './quizzes.service';

enum QuestionType {
    SINGLE_CORRECT,
    MULTIPLE_CORRECT,
    SORTING,
    PLAIN_TEXT,
}

const quizArray = [{
    id: 1,
    name: 'Quiz1',
}];

const questionArray = [{
    question: 'Question1',
    type: QuestionType.SINGLE_CORRECT,
    answerIds: [1],
    answerOptions: ['Answer1'],
}];

const oneQuiz = quizArray[0];

const oneQuestion = {
    quiz: oneQuiz,
    question: 'Question1',
    type: 'Single correct',
};

const oneAnswer = {
    question: oneQuestion,
    option: 'Answer1',
    correct: 1,
};

describe('QuizzesService', () => {
    let service: QuizzesService;
    let quizRepository: Repository<QuizEntity>;
    let questionRepository: Repository<QuestionEntity>;
    let optionRepository: Repository<QuestionOption>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizzesService,
                {
                    provide: getRepositoryToken(QuizEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(quizArray),
                        findOneById: jest.fn().mockResolvedValue(oneQuiz),
                        save: jest.fn().mockResolvedValue(oneQuiz),
                    },
                },
                {
                    provide: getRepositoryToken(QuestionEntity),
                    useValue: {
                        save: jest.fn().mockResolvedValue(oneQuestion),
                    },
                },
                {
                    provide: getRepositoryToken(QuestionOption),
                    useValue: {
                        save: jest.fn().mockResolvedValue(oneAnswer),
                    },
                },
            ],
        }).useMocker((token) => {
            if (token === QuestionsService) {
                return {
                    findEntities: jest.fn().mockResolvedValue([oneQuestion]),
                    transformQuestions: jest.fn().mockResolvedValue(questionArray),
                };
            }
        }).compile();

        service = module.get<QuizzesService>(QuizzesService);
        quizRepository = module.get<Repository<QuizEntity>>(getRepositoryToken(QuizEntity));
        questionRepository = module.get<Repository<QuestionEntity>>(getRepositoryToken(QuestionEntity));
        optionRepository = module.get<Repository<QuestionOption>>(getRepositoryToken(QuestionOption));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll()', () => {
        const outputQuizzes = [
            {
                id: 1,
                name: 'Quiz1',
                questions: [
                    {
                        question: 'Question1',
                        type: QuestionType.SINGLE_CORRECT,
                        answerIds: [1],
                        answerOptions: ['Answer1'],
                    },
                ],
            },
        ];
        it('should return an array of quizzes', async () => {
            const quizzes = await service.findAll();
            expect(quizzes).toEqual(outputQuizzes);
        });
    });

    describe('findOneById()', () => {
        const outputQuiz = {
            id: 1,
            name: 'Quiz1',
            questions: [
                {
                    question: 'Question1',
                    type: QuestionType.SINGLE_CORRECT,
                    answerIds: [1],
                    answerOptions: ['Answer1'],
                },
            ],
        };
        it('should get a single quiz', () => {
            expect(service.findOneById(1)).resolves.toEqual(outputQuiz);
        });
    });

    describe('findOneEntity()', () => {
        it('should get a single quiz entity', () => {
            expect(service.findOneEntity(1)).resolves.toEqual(oneQuiz);
        });
    });

    describe('addQuiz()', () => {
        const outputQuiz = {
            id: 1,
            name: 'Quiz1',
            questions: [
                {
                    question: 'Question1',
                    type: QuestionType.SINGLE_CORRECT,
                    answerIds: [1],
                    answerOptions: ['Answer1'],
                },
            ],
        };
        it('should add quiz to a repository', async () => {
            const quizSpy = jest.spyOn(quizRepository, 'save');
            const questionSpy = jest.spyOn(questionRepository, 'save');
            const answerSpy = jest.spyOn(optionRepository, 'save');
            const quiz = await service.addQuiz(
                'Quiz1',
                [{
                    question: 'Question1',
                    type: QuestionType.SINGLE_CORRECT,
                    answerOptions: ['Answer1'],
                }],
                ['1'],
            );

            expect(quizSpy).toBeCalledWith({ name: 'Quiz1' });
            expect(questionSpy).toBeCalledWith(oneQuestion);
            expect(answerSpy).toBeCalledWith(oneAnswer);
            expect(quiz).toEqual(outputQuiz);
        });
    });
});
