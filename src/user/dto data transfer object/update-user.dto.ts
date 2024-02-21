import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
//* وراث كل الخواص من الكريت لكن كلها اختيارية
//? PartialType => what make all required fields optional 