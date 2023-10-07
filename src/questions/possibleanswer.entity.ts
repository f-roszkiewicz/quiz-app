import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity()
export class PossibleAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QuestionEntity, question => question.possibleAnswers)
    question: QuestionEntity;

    @Column()
    answer: string;
}
