import { QuizEntity } from '../quizzes/quiz.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionOption } from './questionoption.entity';

@Entity()
export class QuestionEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QuizEntity, quiz => quiz.questions)
    quiz: QuizEntity;
    
    @Column()
    question: string;

    @Column()
    type: string;

    @OneToMany(type => QuestionOption, questionOption => questionOption.question)
    questionOptions: QuestionOption[];

    @Column({ default: '' })
    plainTextAnswer: string;
}
