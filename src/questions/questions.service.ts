import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, Repository } from 'typeorm';
import { Question, QuestionType } from './models/question.model';
import { QuestionOption } from './questionoption.entity';
import { QuestionEntity } from './question.entity';

@Injectable()
export class QuestionsService {
    constructor(
        @InjectRepository(QuestionEntity)
        private questionRepository: Repository<QuestionEntity>,
        @InjectRepository(QuestionOption)
        private optionRepository: Repository<QuestionOption>,
    ) {}

    private async transformQuestions(questions: QuestionEntity[]) {
        const retQuestions = [] as Question[];
        
        const questionType = {
            'Single correct': QuestionType.SINGLE_CORRECT,
            'Multiple correct': QuestionType.MULTIPLE_CORRECT,
            'Sorting': QuestionType.SORTING,
            'Plain text': QuestionType.PLAIN_TEXT,
        };
        const quizAnswers = await this.optionRepository.find({
            where: {
                question: {
                    quiz: {
                        id: questions[0].quiz.id,
                    }
                },
            },
            relations: {
                question: true,
            },
        });
        for (let i = 0; i < questions.length; i++) {
            const question = new Question();
            question.question = questions[i].question;
            question.type = questionType[questions[i].type];

            question.answerIds = [];
            question.answerOptions = [];
            quizAnswers.forEach((ans) => {
                if (ans.question.id === questions[i].id) {
                    question.answerIds.push(ans.id);
                    question.answerOptions.push(ans.option);
                }
            });

            retQuestions.push(question);
        }

        return retQuestions;
    }

    async findEntities(options?: FindManyOptions<QuestionEntity>) {
        return this.questionRepository.find(options);
    }

    async findOptionEntities(options?: FindManyOptions<QuestionOption>) {
        return this.optionRepository.find(options);
    }

    async findAll(id: number) {
        const questions = await this.questionRepository.find({
            where: {
                quiz: {
                    id: id,
                },
            },
            relations: {
                quiz: true,
            },
        });
        return this.transformQuestions(questions);
    }
}
