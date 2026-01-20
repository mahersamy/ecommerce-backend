import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { TokenService } from 'src/common';
import { HashService } from 'src/common';
import { EncryptionService } from 'src/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _hashService: HashService,
    private readonly _tokenService: TokenService,
    private readonly _encryptionService: EncryptionService,
  ) {}

  async register(user: RegisterBodyDto) {
    const existingUser = await this._userRepo.findOne({ email: user.email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this._hashService.hash(user.password);
    const encryptedPhoneNumber = await this._encryptionService.encrypt(
      user.phoneNumber,
    );
    const newUser = await this._userRepo.create({
      ...user,
      password: hashedPassword,
      phoneNumber: encryptedPhoneNumber,
    });
    return {
      data: newUser,
    };
  }

  async login(user: LoginBodyDto) {
    const existingUser = await this._userRepo.findOne({ email: user.email });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await this._hashService.verify(
      existingUser.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const accessToken = await this._tokenService.generateToken(
      { _id: existingUser._id },
      { expiresIn: '1h', secret: process.env.JWT_SECRET_BEARER_ACCESS },
    );
    const refreshToken = await this._tokenService.generateToken(
      { _id: existingUser._id },
      { expiresIn: '1y', secret: process.env.JWT_SECRET_BEARER_REFRESH },
    );
    return {
      credential: {
        accessToken,
        refreshToken,
      },
    };
  }
}
