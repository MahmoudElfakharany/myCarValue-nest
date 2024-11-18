import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from './user.entity';
import { AuthGuard } from './gaurds/auth.gaurd';

@Controller('auth')
export class UsersController {
    constructor(private userService:UsersService, private authService: AuthService){}



    @Post("signup")
    async createUser(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authService.signup(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post("signin")
    async signin(@Body() body:CreateUserDto, @Session() session:any){
        const user = await this.authService.signin(body.email, body.password)
        session.userId = user.id
        return user
    }

    @Post("signout")
    signout(@Session() session:any){
        session.userId = null
    }

    // @Get("whoami")
    // async whoami(@Session() session:any){
    //     const user = await this.userService.findOne(session.userId)
    //     if (!user) {
    //         return new NotFoundException("User not found")
    //     }
    //     return user
    // }


    @Get("whoami")
    @UseGuards(AuthGuard)
    async whoami(@CurrentUser() user:User){
        return user
    }

    @UseInterceptors(new SerializeInterceptor(UserDto))
    @Get("/:id")
     async findUser(@Param('id') id:string){

        const user = await this.userService.findOne(parseInt(id))

        if (!user) throw new NotFoundException("No such user")
        return user
    }

    @Get()
     findAllUsers(@Query("email") email:string){
        return this.userService.find(email )
    }

    @Delete("/:id")
     removeUser(@Param('id') id:string){
        return  this.userService.remove(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param("id") id:string , @Body() body:UpdateUserDto){
        return this.userService.update(parseInt(id),body)
    }
}
