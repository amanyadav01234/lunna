const Habit = require('../models/Habit');

// @desc    Get all habits
// @route   GET /habits
// @access  Public
const getHabits = async (req, res) => {
    try {
        const habits = await Habit.find().sort({ createdAt: -1 });
        res.status(200).json(habits);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create a new habit
// @route   POST /habits
// @access  Public
const createHabit = async (req, res) => {
    try {
        if (!req.body.name) {
            return res.status(400).json({ message: 'Please add a habit name' });
        }

        const habit = await Habit.create({
            name: req.body.name,
        });

        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Mark habit as completed
// @route   PATCH /habits/:id/complete
// @access  Public
const markComplete = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastCompleted = habit.lastCompleted ? new Date(habit.lastCompleted) : null;
        if (lastCompleted) {
            lastCompleted.setHours(0, 0, 0, 0);
        }

        // Check if already completed today
        if (lastCompleted && lastCompleted.getTime() === today.getTime()) {
            // Already completed today, maybe toggle off? 
            // Requirement says "toggle Completed today", implying if it's done, undo it?
            // Or just "Mark as Completed". Usually "toggle" means on/off.
            // Let's implement toggle behavior for better UX, or just idempotent "mark done".
            // The requirement says "Tap a habit to toggle Completed today".
            // So if it IS completed today, we should probably un-complete it and decrement streak.

            // However, for simplicity and "Mark as Completed" wording in backend reqs: "PATCH ... - mark as completed"
            // I will stick to idempotent "mark as completed" unless it's already done today.
            // Actually, let's just update it. If it was yesterday, streak++. If it was today, do nothing or return success.
            // Wait, "Automatically increase the streak count."

            // Logic:
            // If lastCompleted was yesterday (or before), update lastCompleted to today and streak++.
            // If lastCompleted was today, do nothing (already done).

            if (lastCompleted.getTime() === today.getTime()) {
                return res.status(200).json({ message: 'Habit already completed today', habit });
            }

            // Check if streak is broken (last completed was before yesterday)
            // Actually, simple habit trackers often just increment streak if you do it.
            // But let's try to be smart.
            const yesterday = new Date(today);
            yesterday.setDate(yesterday.getDate() - 1);

            if (lastCompleted && lastCompleted.getTime() === yesterday.getTime()) {
                habit.streak += 1;
            } else if (lastCompleted && lastCompleted.getTime() < yesterday.getTime()) {
                habit.streak = 1; // Streak broken, restart
            } else {
                // First time or restart
                if (habit.streak === 0) habit.streak = 1;
                else habit.streak += 1; // Fallback if logic is simple
            }
        } else {
            // Never completed
            habit.streak = 1;
        }

        habit.lastCompleted = new Date();
        await habit.save();

        res.status(200).json(habit);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a habit
// @route   DELETE /habits/:id
// @access  Public
const deleteHabit = async (req, res) => {
    try {
        const habit = await Habit.findById(req.params.id);

        if (!habit) {
            return res.status(404).json({ message: 'Habit not found' });
        }

        await habit.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getHabits,
    createHabit,
    markComplete,
    deleteHabit,
};
