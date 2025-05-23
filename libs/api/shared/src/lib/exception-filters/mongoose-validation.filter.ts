import { UserInputError } from '@nestjs/apollo';
import { Catch } from '@nestjs/common';
import { GqlExceptionFilter } from '@nestjs/graphql';

import { ValidationError } from 'mongoose/lib/error';

@Catch(ValidationError)
export class MongooseValidationFilter implements GqlExceptionFilter {
  catch(exception: ValidationError) {
    throw new UserInputError(exception.name, {
      extensions: {
        errors: exception.errors,
      },
    });
  }
}
