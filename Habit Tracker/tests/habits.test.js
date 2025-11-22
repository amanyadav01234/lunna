const request = require('supertest');
const app = require('../src/app');
const Habit = require('../src/models/Habit');

// Mock the Habit model
jest.mock('../src/models/Habit');

describe('Habit API', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /habits', () => {
        it('should return all habits', async () => {
            const mockHabits = [
                { name: 'Drink Water', streak: 0 },
                { name: 'Exercise', streak: 2 },
            ];
            Habit.find.mockReturnValue({
                sort: jest.fn().mockResolvedValue(mockHabits),
            });

            const res = await request(app).get('/habits');

            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual(mockHabits);
            expect(Habit.find).toHaveBeenCalled();
        });
    });

    describe('POST /habits', () => {
        it('should create a new habit', async () => {
            const newHabit = { name: 'Read Books' };
            Habit.create.mockResolvedValue(newHabit);

            const res = await request(app).post('/habits').send(newHabit);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toEqual(newHabit);
            expect(Habit.create).toHaveBeenCalledWith(newHabit);
        });

        it('should return 400 if name is missing', async () => {
            const res = await request(app).post('/habits').send({});

            expect(res.statusCode).toEqual(400);
        });
    });

    describe('POST /suggest-habits', () => {
        it('should return suggestions based on goal', async () => {
            const goal = 'Health';
            const res = await request(app).post('/suggest-habits').send({ goal });

            expect(res.statusCode).toEqual(200);
            expect(res.body.suggestions).toHaveLength(3);
            expect(res.body.suggestions[0]).toContain(goal);
        });
    });
});
