import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PossibleAnswer } from './possibleanswer.entity';
import { QuestionEntity } from './question.entity';
import { QuestionsService } from './questions.service';

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
    possibleAnswers: [],
    answer: 'a',
}];

const answerArray = [{
    question: questionArray[0],
    answer: 'a) Answer1',
}];

describe('QuestionsService', () => {
    let service: QuestionsService;
    let questionRepository: Repository<QuestionEntity>;
    let answerRepository: Repository<PossibleAnswer>;

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
                    provide: getRepositoryToken(PossibleAnswer),
                    useValue: {
                        find: jest.fn().mockResolvedValue(answerArray),
                    },
                },
            ],
        }).compile();

        service = module.get<QuestionsService>(QuestionsService);
        questionRepository = module.get<Repository<QuestionEntity>>(getRepositoryToken(QuestionEntity));
        answerRepository = module.get<Repository<PossibleAnswer>>(getRepositoryToken(PossibleAnswer));
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('transformQuestions()', () => {
        it('should return question model array', () => {
            expect(service.transformQuestions(questionArray)).resolves.toEqual([{
                question: 'Question1',
                type: 0,
                answers: ['a) Answer1'],
            }]);
        });
    });

    describe('findEntities()', () => {
        it('should get question entities', () => {
            expect(service.findEntities()).resolves.toEqual(questionArray);
        });
    });

    describe('findAll()', () => {
        it('should get question array', () => {
            expect(service.findAll(1)).resolves.toEqual([{
                question: 'Question1',
                type: 0,
                answers: ['a) Answer1'],
            }]);
        });
    });
});
