import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginBodyDto, RegisterBodyDto } from './auth.dto';
import { UserRepository } from 'src/DB/Repository/user.repository';
import { OtpType, TokenService } from 'src/common';
import { HashService } from 'src/common';
import { EncryptionService } from 'src/common';
import { OtpRepository } from 'src/DB/Repository/otp.repository';
import { emailEvent } from 'src/common/utils/email/email.event';
import { generateOtp } from 'src/common/utils';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userRepo: UserRepository,
    private readonly _otpRepo: OtpRepository,
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

    const { otp, hashOtp, otpExpire } = await generateOtp();
    await this._otpRepo.create({
      code: hashOtp,
      expiresAt: otpExpire,
      createdBy: newUser._id,
      type: OtpType.ConfirmEmail,
    });

    emailEvent.emit('sendOtp', newUser.email, otp);

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
