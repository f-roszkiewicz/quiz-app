import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuestionEntity } from './question.entity';

@Entity()
export class QuestionOption {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(type => QuestionEntity, question => question.questionOptions)
    question: QuestionEntity;

    @Column()
    option: string;

    @Column({ default: 0 })
    correct: number;
}
