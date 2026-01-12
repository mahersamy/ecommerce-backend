import { Injectable } from "@nestjs/common";
import { JwtService, JwtSignOptions, JwtVerifyOptions } from "@nestjs/jwt";



@Injectable()
export class TokenUtil {
    constructor(private readonly _jwtService: JwtService) {}


    async generateToken(payload: object,options:JwtSignOptions) {
        return this._jwtService.sign(payload,options);
    }
    async verifyToken(token:string,options:JwtVerifyOptions) {
        return this._jwtService.verify(token,options);
    }
    
}