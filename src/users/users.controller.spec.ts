import { Session } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { User } from './user.entity';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    let users: User[] = [];

    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'aaa@aaa.com',
          password: 'aaaa',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'aaaa' },
          { id: 2, email, password: 'aaaa' },
        ] as User[]);
      },
      remove: (id: number) => {
        return Promise.resolve({
          id,
          email: 'aaa@aaa.com',
          password: 'aaaa',
        } as User);
      },
      update: (id: number, attrs: Partial<User>) => {
        return Promise.resolve({
          id,
          email: attrs.email,
          password: attrs.password,
        } as User);
      },
    };

    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
      signup: (email: string, password: string) => {
        return Promise.resolve({
          id: 1,
          email,
          password,
        } as User);
      },
    };
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('FindsAllUsers returns all users', async () => {
    const users = await controller.findAllUsers('qqqq@2222');
    expect(users.length).toEqual(2);
    expect(users[0].email).toEqual('qqqq@2222');
  });

  it('FindOne returns One user', async () => {
    const user = await controller.findUser('1');
    expect(user).toBeDefined();
  });

  it('FindOne trows an error when no One user', async () => {
    fakeUsersService.findOne = () => {
      return null;
    };
    await expect(controller.findUser('1')).rejects.toThrow();
  });

  it('be able to sign in user and updates session', async () => {
    let session = {userId:121212}
    const user = await controller.signin(
      { email: 'aaa@dddd', password: 'dddddd' } as User,
      session,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
