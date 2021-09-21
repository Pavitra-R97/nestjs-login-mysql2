import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){

  }

  getHello(): string {
    return "Hello Pavitra!"
  }
  async create(data:User):Promise<User>{
    return this.userRepository.save(data);
    }

    async findOne(condition :any){
      return this.userRepository.findOne(condition);
    }
}
