import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { QuestionsService } from '../questions/questions.service';
import { DataSource, Repository } from 'typeorm';
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

const dataSourceMockFactory: () => MockType<DataSource> = jest.fn(() => ({}));
  
type MockType<T> = {
    [P in keyof T]?: jest.Mock<{}>;
};

describe('QuizzesService', () => {
    let service: QuizzesService;
    let quizRepository: Repository<QuizEntity>;
    let dataSourceMock: MockType<DataSource>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuizzesService,
                {
                    provide: getRepositoryToken(QuizEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(quizArray),
                        findOneById: jest.fn().mockResolvedValue(oneQuiz),
                    },
                },
                {
                    provide: DataSource,
                    useFactory: dataSourceMockFactory,
                },
            ],
        }).useMocker((token) => {
            if (token === QuestionsService) {
                return {
                    findAll: jest.fn().mockResolvedValue(questionArray),
                };
            }
        }).compile();

        service = module.get<QuizzesService>(QuizzesService);
        quizRepository = module.get<Repository<QuizEntity>>(getRepositoryToken(QuizEntity));
        dataSourceMock = module.get(DataSource);
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
});
