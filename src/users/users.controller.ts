import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  Patch,
  Delete,
  Session,
  UseInterceptors,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/create-user.decorators';
import { Serialize } from 'src/interceptors/serialize.interceptos';
import { UserDto } from './dtos/users.dto';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptors';
import { User } from './users.entity';
import { AuthGuard } from 'src/guards/auth.guards';

@Controller('auth')
@Serialize(UserDto)
@UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('whoami')
  @UseGuards(AuthGuard)
  whoami(@CurrentUser() user: User) {
    return user;
  }

  @Get('signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Post('signup')
  async signup(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Get('/:id')
  findUser(@Param('id') id: string) {
    console.log('findUser running');
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
