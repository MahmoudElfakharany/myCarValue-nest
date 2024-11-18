import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService> 

  beforeEach(async () => {
    let users: User[] = []

     fakeUsersService = {
      find: (email:string) => {
        const filteredUsers: User[] =  users.filter(user=>user.email === email)
        return Promise.resolve(filteredUsers)
      },
      create: (email: string, password: string) =>{
        const user ={id:Math.floor(Math.random()*8988),email,password} as User
        users.push(user)

        return Promise.resolve(user)
      },
    };
    
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  ////////////////////////////////////////////////////// TESTS
  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a user', async () => {
    const user = await service.signup('lol@lol.lol', 'lol');

    expect(user.password).not.toEqual('lol');
    const [pass, hash] = user.password.split('.');
    expect(pass).toBeDefined();
    expect(hash).toBeDefined();
  });

  it("Throws an error when signup with existing email", async ()=>{ 
      await service.signup("lol@lol.lol", "lol")
      await expect(service.signup("lol@lol.lol", "lol")).rejects.toThrow();
  })

  it("Throws error when sign in with NOT existing email" , async()=>{
    await expect(service.signin("lol@lol.lol", "lol")).rejects.toThrow();
  })

  it("Throws in password is invalid", async()=>{

    await service.signup("lwswsol@lol.com","lold" )
    await expect(service.signin("lwswsol@lol.com","lol" )).rejects.toThrow()
  })

  it("Return user if correct password is provided", async()=>{
   
    await service.signup("lwswsol@lol.com","lol" )
    const user = await service.signin("lwswsol@lol.com","lol" )

    expect(user).toBeDefined()

    
  })

})