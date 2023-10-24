import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswersModule } from './answers/answers.module';
import { QuestionOption } from './questions/questionoption.entity';
import { QuestionEntity } from './questions/question.entity';
import { QuestionsModule } from './questions/questions.module';
import { QuizEntity } from './quizzes/quiz.entity';
import { QuizzesModule } from './quizzes/quizzes.module';

@Module({
  imports: [
    QuizzesModule,
    QuestionsModule,
    AnswersModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      entities: [QuizEntity, QuestionEntity, QuestionOption],
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
})
export class AppModule {}
