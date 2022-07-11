import { AuthController } from './auth/auth.controller';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommonModule } from './common/common.module';
import { CompaniesModule } from './companies/companies.module';
import { UploadModule } from './upload/upload.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CoffeesModule } from './coffees/coffees.module';
import { PostsModule } from './posts/posts.module';
import { PaymentsModule } from './payments/payments.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      playground: process.env.NODE_ENV !== 'production',
    }),
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'], // 왼쪽부터 우선순위가 높다.
    }),
    AuthModule,
    CommonModule,
    CompaniesModule,
    UploadModule,
    BookmarksModule,
    NotificationsModule,
    CoffeesModule,
    PostsModule,
    PaymentsModule,
  ],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
