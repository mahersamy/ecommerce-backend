import { Injectable } from '@nestjs/common';
import { UserRepository } from '../../DB/Repository/user.repository';

@Injectable()
export class UserService {
  constructor(private readonly _userRepository: UserRepository) {}
}
