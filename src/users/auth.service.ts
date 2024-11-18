import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { promisify } from 'util';
import { scrypt as _scrypt, randomBytes } from 'crypto';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  // SIGN UP
  async signup(email: string, password: string) {
    // Check email existence
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already exists');
    }

    // ** Hashing password ** TODO: Refactor this to function
    // Generate a salt
    const salt = randomBytes(8).toString('hex');

    // Hash the password and the salt together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hash and the result
    const result = salt + '.' + hash.toString('hex');

    // Create the user
    const user = this.usersService.create(email, result);

    return user;
  }

  // SIGN IN
  async signin(email: string, password: string) {
    // Check user existence
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Compare entered password with stored password //TODO: use function
    const [salt, storedHash] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedHash) {
      throw new BadRequestException('Wrong credentials');
    }
    return user;
  }
}
