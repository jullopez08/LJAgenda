import { PrismaClient, WeekDay } from '@prisma/client';

const prisma = new PrismaClient();

console.log(WeekDay.MONDAY);

console.log(prisma.doctorAvailability);