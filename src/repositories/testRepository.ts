import prisma from '../config/database.js';
import { tests } from '@prisma/client';
import { number } from 'joi';

export type CreateTestData = Omit<tests, 'id'>;

export async function insertTestData (testData: CreateTestData) {
    
    await prisma.tests.create({ data: testData });

}

export async function findCategoryById (categoryId: number) {
    
    const result = await prisma.categories.findUnique({ where: { id: categoryId } });

    return result;

}

export async function findTeachersDisciplineById(teacherDisciplineId: number) {
    
    const result = await prisma.teachersDisciplines.findUnique({ where: { id: teacherDisciplineId } });

    return result;

}

export async function findByDiscipline() {

    const result = await prisma.terms.findMany({

        select: {
            number: true,
            disciplines: {
                select: {
                    id: true,
                    name: true,
                    teachersDisciplines: {
                        select: {
                            teachers: { 
                                select: { 
                                    name: true 
                                } 
                            },
                            tests: {
                                select: {
                                    name: true,
                                    pdfUrl: true,
                                    category: { 
                                        select: { 
                                            name: true 
                                        } 
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },

    });
  
    return result;

}
  
export async function findByTeacher() {

    const result = await prisma.teachers.findMany({

        select: {
            id: true,
            name: true,
            teachersDisciplines: {
                select: {
                    disciplines: {
                        select: {
                            name: true,
                            terms: { 
                                select: { 
                                    number: true 
                                } 
                            },
                        },
                    },
                    tests: {
                        select: {
                            name: true,
                            pdfUrl: true,
                            category: { 
                                select: { 
                                    name: true 
                                } 
                            },
                        },
                    },
                },
            },
        },
    });
  
    return result;

}
