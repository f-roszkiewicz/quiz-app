import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetQuizArgs } from './dto/get-quiz.args';
import { Quiz } from './models/quiz.model';
import { QuizEntity } from './quiz.entity';

@Injectable()
export class QuizzesService {
    constructor(
        @InjectRepository(QuizEntity)
        private quizRepository: Repository<QuizEntity>,
    ) {}

    async findAll() {
        return this.quizRepository.find();
    }
    
    async findOneById(id: number) {
        return this.quizRepository.findOneById(id);
    }

    async addQuiz(args: GetQuizArgs) {
        const quiz = new QuizEntity();
        quiz.name = args.name;

        // add questions
        const addedQuiz = this.quizRepository.save(quiz);

        const retQuiz = new Quiz();
        retQuiz.id = (await addedQuiz).id;
        retQuiz.name = args.name;
        retQuiz.questions = args.questions;
        return retQuiz;
    }
}
