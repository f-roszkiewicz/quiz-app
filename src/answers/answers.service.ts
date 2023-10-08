import { Injectable } from '@nestjs/common';
import { GetAnswerArgs } from './dto/get-answer.args';

@Injectable()
export class AnswersService {
    async answer(args: GetAnswerArgs) {
        return [];
    }
}
