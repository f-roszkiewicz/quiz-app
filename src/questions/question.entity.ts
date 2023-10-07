import { QuizEntity } from 'src/quizzes/quiz.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PossibleAnswer } from './possibleanswer.entity';

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

    @OneToMany(type => PossibleAnswer, possibleAnswer => possibleAnswer.question)
    possibleAnswers: PossibleAnswer[];

    @Column()
    answer: string;
}
