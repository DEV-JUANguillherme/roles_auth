import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';


@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('signup')
    // vamos então criar nosso método de sign up
    signUp(@Body() body: any){
        // aqui vamos criar um novo usuário
        const {email, password} = body;
        return this.authService.singUp(email, password);
    }

    @Post('signin')
    // vamos então criar nosso método de sign up
    signIp(@Body() body: any){
        // aqui vamos criar um novo usuário
        const {email, password} = body;
        return this.authService.signIn(email, password);
    }
}
