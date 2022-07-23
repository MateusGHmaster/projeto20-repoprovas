import { CreateTestData } from '../repositories/testRepository.js';
import * as testRepository from '../repositories/testRepository.js';

export async function createTestService (testData: CreateTestData) {
    
    const category = await testRepository.findCategoryById(testData.categoryId);

    if (!category) {
        throw {
            type: 'not_found',
            message: 'Category: not found'
        }
    }

    const teachersDiscipline = await testRepository.findTeachersDisciplineById(testData.teacherDisciplineId);

    if (!teachersDiscipline) {
        throw {
            type: 'not_found',
            message: 'Teachers discipline: not found'
        }
    }

    await testRepository.insertTestData(testData);

}

export async function getByDiscipline () {
    
    const disciplineTests = await testRepository.findByDiscipline();

    return disciplineTests;

}

export async function getByTeacher () {
    
    const teacherTests = await testRepository.findByTeacher();

    return teacherTests;

}