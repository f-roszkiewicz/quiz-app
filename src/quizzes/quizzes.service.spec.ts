import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PossibleAnswer } from '../questions/possibleanswer.entity';
import { QuestionEntity } from '../questions/question.entity';
import { QuestionsService } from '../questions/questions.service';
import { Repository } from 'typeorm';
import { QuizEntity } from './quiz.entity';
import { QuizzesService } from './quizzes.service';

const quizArray = [
    {
        id: 1,
        name: 'Quiz1',
    },
];

const questionArray = [{
    question: 'Question1',
    type: 0,
    answers: ['Answer1'],
}];

const oneQuiz = {
    id: 1,
    name: 'Quiz1',
};

const oneQuestion = {
    quiz: oneQuiz,
    question: 'Question1',
    type: 'Single correct',
    answer: 'a',
};

const oneAnswer = {
    question: oneQuestion,
    answer: 'a) Answer1',
};

describe('QuizzesService', () => {
    let service: QuizzesService;
    let quizRepository: Repository<QuizEntity>;
    let questionRepository: Repository<QuestionEntity>;
    let answerRepository: Repository<PossibleAnswer>;

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
                    provide: getRepositoryToken(PossibleAnswer),
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
        answerRepository = module.get<Repository<PossibleAnswer>>(getRepositoryToken(PossibleAnswer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findAll()', () => {
        const outPutQuizzes = [
            {
                id: 1,
                name: 'Quiz1',
                questions: [
                    {
                        question: 'Question1',
                        type: 0,
                        answers: ['Answer1'],
                    },
                ],
            },
        ];
        it('should return an array of quizzes', async () => {
            const quizzes = await service.findAll();
            expect(quizzes).toEqual(outPutQuizzes);
        });
    });

    describe('findOneById()', () => {
        const outPutQuiz = {
            id: 1,
            name: 'Quiz1',
            questions: [
                {
                    question: 'Question1',
                    type: 0,
                    answers: ['Answer1'],
                },
            ],
        };
        it('should get a single quiz', () => {
            expect(service.findOneById(1)).resolves.toEqual(outPutQuiz);
        });
    });

    describe('findOneEntity()', () => {
        it('should get a single quiz entity', () => {
            expect(service.findOneEntity(1)).resolves.toEqual(oneQuiz);
        });
    });

    describe('addQuiz()', () => {
        const outPutQuiz = {
            id: 1,
            name: 'Quiz1',
            questions: [
                {
                    question: 'Question1',
                    type: 0,
                    answers: ['Answer1'],
                },
            ],
        };
        it('should add quiz to a repository', async () => {
            const quizSpy = jest.spyOn(quizRepository, 'save');
            const questionSpy = jest.spyOn(questionRepository, 'save');
            const answerSpy = jest.spyOn(answerRepository, 'save');
            const quiz = await service.addQuiz({
                name: 'Quiz1',
                questions: [{
                    question: 'Question1',
                    type: 0,
                    answers: ['Answer1'],
                }],
                answers: ['a'],
            });

            expect(quizSpy).toBeCalledWith({ name: 'Quiz1' });
            expect(questionSpy).toBeCalledWith(oneQuestion);
            expect(answerSpy).toBeCalledWith(oneAnswer);
            expect(quiz).toEqual(outPutQuiz);
        });
    });
});
