const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const dataPath = path.join(__dirname, '../../data/habits.json');

// Ensure data file exists
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify([]));
}

const readData = () => {
    const jsonData = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(jsonData);
};

const writeData = (data) => {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
};

class Habit {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.name = data.name;
        this.streak = data.streak || 0;
        this.lastCompleted = data.lastCompleted || null;
        this.createdAt = data.createdAt || new Date();
    }

    static find() {
        const habits = readData();
        return {
            sort: (criteria) => {
                // Basic sorting by createdAt desc (mocking mongoose sort)
                return habits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            }
        };
    }

    static async create(data) {
        const habits = readData();
        const newHabit = new Habit(data);
        habits.push(newHabit);
        writeData(habits);
        return newHabit;
    }

    static async findById(id) {
        const habits = readData();
        const habitData = habits.find(h => h.id === id);
        if (!habitData) return null;

        // Return an object with save and deleteOne methods to mimic Mongoose document
        const habitInstance = new Habit(habitData);

        habitInstance.save = async function () {
            const currentHabits = readData();
            const index = currentHabits.findIndex(h => h.id === this.id);
            if (index !== -1) {
                currentHabits[index] = this;
                writeData(currentHabits);
            }
            return this;
        };

        habitInstance.deleteOne = async function () {
            const currentHabits = readData();
            const filteredHabits = currentHabits.filter(h => h.id !== this.id);
            writeData(filteredHabits);
        };

        return habitInstance;
    }
}

module.exports = Habit;
