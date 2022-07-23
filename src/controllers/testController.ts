import { Request, Response } from 'express';
import { CreateTestData } from '../repositories/testRepository.js';
import * as testService from './../services/testService.js';

export async function createTest (req: Request, res: Response) {

    const testData: CreateTestData = req.body;
    await testService.createTestService(testData);

    res.sendStatus(201);

}

export async function getTestsByDiscipline (req: Request, res: Response) {

    const disciplineTests = await testService.getByDiscipline();
    
    res.send(disciplineTests);

}

export async function getTestsByTeacher (req: Request, res: Response) {

    const teacherTests = await testService.getByTeacher();
    
    res.send(teacherTests);

}