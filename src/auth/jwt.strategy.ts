import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import { ignoreElements } from "rxjs";

@Injectable()
export class jwtStrategy extends PassportStrategy(Strategy){
    constructor(config: ConfigService){
        super({
            secretOrKey: config.getOrThrow('JWT_SECRET'),
            // metodo diz que o token onde ele procura o token
            // fromAuth.. diz que o token esta no cabeçalho de auth como bearer
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            
            // validar a expiração do token e rejeitar caso esteja expirado
            ignoreExpiration: false,
        })

    }

    // esse token ja validado 
    async validate(payload: any){
        return {userId: payload.sub, email: payload.email}
    }


}