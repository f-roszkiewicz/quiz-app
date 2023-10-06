import { Injectable } from '@nestjs/common';

@Injectable()
export class QuizzesService {
    async findAll() {
        return [];
    }
    
    async findOneById(id: number) {
        return {} as any;
    }
}
