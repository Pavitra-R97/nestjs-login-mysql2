import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type:'mysql',
      host:'127.0.0.1',
      port:3306,
      username:'root',
      password:'password',
      database:'yt_nest_auth',
      entities:[User],
      synchronize:true,
      autoLoadEntities: true
    }), 
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret:'secret',
      signOptions:{expiresIn: '6h'}
    }),
  
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
