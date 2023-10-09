import { Test, TestingModule } from '@nestjs/testing';
import { QuestionsService } from '../questions/questions.service';
import { QuizzesService } from '../quizzes/quizzes.service';
import { AnswersService } from './answers.service';

const oneQuiz = {
    id: 1,
    name: 'Quiz1',
};

const questionArray = [{
    quiz: oneQuiz,
    question: 'Question1',
    type: 'Single correct',
    answer: 'a',
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
            expect(service.answer({ quizId: 1, answers: ['a'], })).resolves.toEqual([{
                yourAnswer: 'a',
                correctAnswer: 'a',
            }]);
        });
    });
});
