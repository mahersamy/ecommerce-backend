import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { HashUtil } from 'src/Utils/security/hash.security';
import { EncryptionUtil } from 'src/Utils/security/encryption.security';
import { TokenUtil } from 'src/Utils/security/token.security';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _hashUtil: HashUtil,
    private readonly _encryptionUtil: EncryptionUtil,
    private readonly _tokenUtil: TokenUtil,
  ) {}

  async register(user: RegisterBodyDto) {
    const existingUser = await this._userRepo.findOne({ email: user.email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
    const hashedPassword = await this._hashUtil.hash(user.password);
    const encryptedPhoneNumber = await this._encryptionUtil.encrypt(
      user.phoneNumber,
    );
    const newUser = await this._userRepo.createOne({
      ...user,
      password: hashedPassword,
      phoneNumber: encryptedPhoneNumber,
    });
    return {
      message: 'User registered successfully',
      data: newUser,
    };
  }

  async login(user: LoginBodyDto) {
    const existingUser = await this._userRepo.findOne({ email: user.email });
    if (!existingUser) {
      throw new NotFoundException('User not found');
    }
    const isPasswordMatch = await this._hashUtil.verify(
      existingUser.password,
      user.password,
    );
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid password');
    }
    const token = await this._tokenUtil.generateToken(
      { id: existingUser._id },
      { expiresIn: '1h', secret: process.env.JWT_SECRET_BEARER_ACCESS },
    );
    console.log(token);
    return {
      message: 'User logged in successfully',
      token,
    };
  }
}
