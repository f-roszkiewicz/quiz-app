import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionOption } from './questionoption.entity';
import { QuestionEntity } from './question.entity';
import { QuestionsService } from './questions.service';
import { QuestionType } from './models/question.model';

const oneQuiz = {
    id: 1,
    name: 'Quiz1',
    questions: [],
};

const questionArray = [{
    id: 1,
    quiz: oneQuiz,
    question: 'Question1',
    type: 'Single correct',
    questionOptions: [],
    plainTextAnswer: '',
}];

const optionArray = [{
    id: 1,
    question: questionArray[0],
    option: 'Answer1',
    correct: 1,
}];

describe('QuestionsService', () => {
    let service: QuestionsService;
    let questionRepository: Repository<QuestionEntity>;
    let optionRepository: Repository<QuestionOption>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                QuestionsService,
                {
                    provide: getRepositoryToken(QuestionEntity),
                    useValue: {
                        find: jest.fn().mockResolvedValue(questionArray),
                    },
                },
                {
                    provide: getRepositoryToken(QuestionOption),
                    useValue: {
                        find: jest.fn().mockResolvedValue(optionArray),
                    },
                },
            ],
        }).compile();

        service = module.get<QuestionsService>(QuestionsService);
        questionRepository = module.get<Repository<QuestionEntity>>(getRepositoryToken(QuestionEntity));
        optionRepository = module.get<Repository<QuestionOption>>(getRepositoryToken(QuestionOption));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('findEntities()', () => {
        it('should get question entities', () => {
            expect(service.findEntities()).resolves.toEqual(questionArray);
        });
    });

    describe('findOptionEntities()', () => {
        it('should get question entities', () => {
            expect(service.findOptionEntities()).resolves.toEqual(optionArray);
        });
    });

    describe('findAll()', () => {
        it('should get question array', () => {
            expect(service.findAll(1)).resolves.toEqual([{
                question: 'Question1',
                type: QuestionType.SINGLE_CORRECT,
                answerIds: [1],
                answerOptions: ['Answer1'],
            }]);
        });
    });
});
