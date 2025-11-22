const API_URL = 'http://localhost:5000';

const habitList = document.getElementById('habit-list');
const addHabitForm = document.getElementById('add-habit-form');
const habitNameInput = document.getElementById('habit-name');

// AI Modal Elements
const aiModal = document.getElementById('ai-modal');
const aiSuggestBtn = document.getElementById('ai-suggest-btn');
const closeModal = document.querySelector('.close-modal');
const getSuggestionsBtn = document.getElementById('get-suggestions-btn');
const goalInput = document.getElementById('goal-input');
const suggestionsList = document.getElementById('suggestions-list');

// Fetch and display habits
async function fetchHabits() {
    try {
        const res = await fetch(`${API_URL}/habits`);
        const habits = await res.json();
        renderHabits(habits);
    } catch (error) {
        console.error('Error fetching habits:', error);
    }
}

function renderHabits(habits) {
    habitList.innerHTML = '';
    habits.forEach(habit => {
        const li = document.createElement('li');
        li.className = 'habit-item';

        const isCompletedToday = isToday(new Date(habit.lastCompleted));

        li.innerHTML = `
            <div class="habit-info">
                <div class="habit-name">${habit.name}</div>
                <div class="habit-streak">🔥 Streak: ${habit.streak} days</div>
            </div>
            <div class="habit-actions">
                <button class="check-btn ${isCompletedToday ? 'completed' : ''}" onclick="toggleComplete('${habit.id}')">
                    ✓
                </button>
                <button class="delete-btn" onclick="deleteHabit('${habit.id}')">
                    🗑️
                </button>
            </div>
        `;
        habitList.appendChild(li);
    });
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
}

// Add Habit
addHabitForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = habitNameInput.value;

    try {
        await fetch(`${API_URL}/habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        habitNameInput.value = '';
        fetchHabits();
    } catch (error) {
        console.error('Error adding habit:', error);
    }
});

// Toggle Complete
async function toggleComplete(id) {
    try {
        await fetch(`${API_URL}/habits/${id}/complete`, {
            method: 'PATCH'
        });
        fetchHabits();
    } catch (error) {
        console.error('Error marking complete:', error);
    }
}

// Delete Habit
async function deleteHabit(id) {
    if (!confirm('Are you sure?')) return;

    try {
        await fetch(`${API_URL}/habits/${id}`, {
            method: 'DELETE'
        });
        fetchHabits();
    } catch (error) {
        console.error('Error deleting habit:', error);
    }
}

// AI Suggestions Logic
aiSuggestBtn.onclick = () => aiModal.classList.remove('hidden');
closeModal.onclick = () => aiModal.classList.add('hidden');
window.onclick = (e) => {
    if (e.target == aiModal) aiModal.classList.add('hidden');
}

getSuggestionsBtn.onclick = async () => {
    const goal = goalInput.value;
    if (!goal) return;

    suggestionsList.innerHTML = '<li>Loading...</li>';

    try {
        const res = await fetch(`${API_URL}/suggest-habits`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ goal })
        });
        const data = await res.json();

        suggestionsList.innerHTML = '';
        data.suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.onclick = () => {
                habitNameInput.value = suggestion;
                aiModal.classList.add('hidden');
            };
            suggestionsList.appendChild(li);
        });
    } catch (error) {
        suggestionsList.innerHTML = '<li>Error getting suggestions</li>';
    }
};

// Initial Load
fetchHabits();

// Expose functions to window for onclick handlers
window.toggleComplete = toggleComplete;
window.deleteHabit = deleteHabit;
