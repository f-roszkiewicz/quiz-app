import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Question, QuestionType } from './models/question.model';
import { PossibleAnswer } from './possibleanswer.entity';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(PossibleAnswer)
        private answerRepository: Repository<PossibleAnswer>,
    ) {}

    async transformQuestions(questions: QuestionEntity[]) {
        const retQuestions = [] as Question[];
        
        const questionType = {
            'Single correct': QuestionType.SINGLE_CORRECT,
            'Multiple correct': QuestionType.MULTIPLE_CORRECT,
            'Sorting': QuestionType.SORTING,
            'Plain text': QuestionType.PLAIN_TEXT,
        };
        for (let i = 0; i < questions.length; i++) {
            const question = new Question();
            question.question = questions[i].question;
            question.type = questionType[questions[i].type];

            const answers = await this.answerRepository.find({
                where: {
                    question: questions[i],
                },
            });

            question.answers = [];
            answers.forEach((a) => {
                question.answers.push(a.answer);
            });

            retQuestions.push(question);
        }

        return retQuestions;
    }

    async findEntities(options?: FindManyOptions<QuestionEntity>) {
        return this.questionRepository.find(options);
    }

    async findAll(id: number) {
        const questions = await this.questionRepository.find();
        return this.transformQuestions(questions);
    }
}
