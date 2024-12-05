import { 
    BadRequestException, 
    Injectable, 
    UnauthorizedException } from '@nestjs/common';

// _ scrypt pois ele trabalha com o padrão de cryptografia mas com callback no final
import {randomBytes, scrypt as _scrypt} from 'crypto'

// vamos tranformar em uma funçãoa async importando 
import { promisify } from 'util';

// e essa vamos usar como uma função async
const scrypt = promisify(_scrypt);

// criando um repositorio falso para ter uma lista de usuarios
const users = []
@Injectable()
export class AuthService {
  // metodo de cadastro 
  async singUp(email: string, password: string){
    const existignUser = users.find(user => user.email === email);
    if(existignUser){
      // vamos então buscar se ja existi
      // caso exista
      return new BadRequestException('email in use')
    }

    // salt === chave unica por cadastro
    const salt = randomBytes(8).toString('hex')
    const hash = await scrypt(password, salt, 32) as Buffer
    // concatenando os 2 valores
    const saltAndHash = `${salt}.${hash.toString('hex')}`

    // user 
    const user = {
      email,
      password: saltAndHash,
    }

    // adicionando o usuario para a lista
    users.push(user)

    console.log('signed up', user)
    // removendo o password do usuario para nao aparecer 
    const {password: _, ...result} = user;
    return result;
  }

  async signIn(email: string, password){
    // buscando o usuario
    const user = users.find(user => user.email === email)
    if(!user){
        // caso o usuario nao exista
        return new UnauthorizedException('invalid credentials')
    }

    // pegando a senha
    const {salt, storedHash} = user.password.split('.');
    // há sacada é - eu sei qual é salt unico desse user, se eu criptogradar novamente a mesma senha
    // eu tenho que chegar no mesmo resultado que esta no banco
    const hash = (await scrypt(password, salt, 32)) as Buffer

    // agora verifique
    if(storedHash !== hash.toString('hex')){
        // caso a senha esteja errada
        return new UnauthorizedException('invalid credentials')
    }

    console.log('sign in', user)
    const {password: _, ...result} = user;
    return result;
  }
}
