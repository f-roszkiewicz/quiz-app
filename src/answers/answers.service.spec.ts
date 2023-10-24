import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../questions/questions.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { AnswersService } from './answers.service';

const oneQuiz = {
    id: 1,
    name: 'Quiz1',
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

describe('AnswersService', () => {
    let service: AnswersService;

    beforeEach(async() => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AnswersService,
            ],
        }).useMocker((token) => {
            if (token === QuestionsService) {
                return {
                    findOptionEntities: jest.fn().mockResolvedValue(optionArray),
                    findEntities: jest.fn().mockResolvedValue(questionArray),
                };
            }
            if (token === QuizzesService) {
                return {
                    findOneEntity: jest.fn().mockResolvedValue(oneQuiz),
                };
            }
        }).compile();

        service = module.get<AnswersService>(AnswersService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('answer()', () => {
        it('should return your answers', () => {
            expect(service.answer(1, ['1'])).resolves.toEqual([{
                yourAnswer: '1',
                correctAnswer: '1',
                correct: true,
            }]);
        });
    });
});
