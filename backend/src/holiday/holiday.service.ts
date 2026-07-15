import { HttpService } from '@nestjs/axios';
import { BadRequestException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class HolidayService {
    constructor(private readonly http: HttpService){}
    private readonly holidaysCache = new Map<number, string[]>();

    async isHoliday(date:string): Promise<void>{
    const year = new Date(date).getFullYear();

    let holidays = this.holidaysCache.get(year);

    if (!holidays) {
      holidays = await this.loadYear(year);
    }

    if (holidays.includes(date)) {
      throw new BadRequestException(
        'No se pueden agendar citas en un día festivo.',
      );
    }
    }
    private async loadYear(year: number): Promise<string[]> {
    const response = await firstValueFrom(
      this.http.get(
        
        `https://date.nager.at/api/v4/Holidays/CO/${year}`,
      ),
    );

    const holidays = response.data.map(
      (holiday: any) => holiday.date,
    );

    this.holidaysCache.set(year, holidays);

    return holidays;
  
}
}
