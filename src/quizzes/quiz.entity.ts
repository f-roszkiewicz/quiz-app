import { QuestionEntity } from 'src/questions/question.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class QuizEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(type => QuestionEntity, question => question.quiz)
    questions: QuestionEntity[];
}
