import { CreateBookmarkInput } from './create-bookmark.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateBookmarkInput extends PartialType(CreateBookmarkInput) {}
