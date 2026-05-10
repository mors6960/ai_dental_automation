import { IsString } from "class-validator";

export class BookCalendarSlotDto {
  @IsString()
  slot!: string;

  @IsString()
  patientName!: string;

  @IsString()
  phone!: string;
}
