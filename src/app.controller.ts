import { BadRequestException, Body, Controller, Get, Post, Req, Res, UnauthorizedException } from '@nestjs/common';
import { profile } from 'console';
import { AppService } from './app.service';
import * as bcrypt from 'bcryptjs'
import { JwtService } from '@nestjs/jwt';
import { Response,Request, response } from 'express';
import { User } from './user.entity';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
    private jwtService:JwtService
    ) {}


    @Get()
    getHello():string {
      return this.appService.getHello();
    }

  @Post('register')
  async register(
    @Body() data: User){
      const hashPassword=await bcrypt.hash(data.password,12);
      data.password = hashPassword;
      const user = await this.appService.create(data);
      delete user.password
      return user;

  } 

  @Post('login')
  async login(
    @Body('email')email:string,
    @Body('password')password:string,
    @Res({passthrough:true}) response:Response
  ){
    const user=await this.appService.findOne({email});
    if(!user){
      throw new BadRequestException('invalid credential');
    }
    if(!await bcrypt.compare(password, user.password)){
      throw new BadRequestException("invalid credentiels");
    }
    

    const jwt= await this.jwtService.signAsync({id: user.id});

    response.cookie('jwt',jwt,{httpOnly:true});
    
    return {
      message:'success'
    };
    
  }

  @Get('user')
  async user(@Req() request:Request){
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie);
   
   
  if (!data){
    throw new UnauthorizedException();
  }
  const user=await this.appService.findOne({id:data['id']});

  const {password, ...result} = user;
  return result; 
  
   }catch(e){
     throw new UnauthorizedException();
   }

   @Post('Logout')
   async Logout(@Res({passthrough: true})response:Response){
     response.clearCookie('jwt');
     return{
       message:'success'
     }

     
   }

  
}
 