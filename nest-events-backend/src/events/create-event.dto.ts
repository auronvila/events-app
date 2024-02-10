import { IsDate, IsDateString, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateEventDto {
  @Length(5, 255)
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsString()
  @IsNotEmpty()
    // The case validators are used when u create pipes locally and not globally,
    // and you need to specify the group of the pipe to be able to create the case below.
    // See the events controller for more details.
    // @Length(5, 255, { groups: ['create'] })
    // @Length(10, 20, { groups: ['update'] })
  address: string;
}
