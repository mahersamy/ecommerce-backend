import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserRepository } from "src/DB/Repository/user.repository";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/DB/Models/users.model";
import { HashUtil } from "src/Utils/security/hash.security";
import { EncryptionUtil } from "src/Utils/security/encryption.security";
import { JwtService } from "@nestjs/jwt";
import { TokenUtil } from "src/Utils/security/token.security";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
    controllers: [AuthController],
    providers: [AuthService,UserRepository,HashUtil,EncryptionUtil,JwtService,TokenUtil],
})
export class AuthModule {}