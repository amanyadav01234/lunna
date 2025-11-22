# Mini Habit Tracker Backend

A simple, structured, and clean Backend API for a Habit Tracker application built with Node.js, Express, and MongoDB.

## Features

- **Habit Management**: Create, Read, Update (Mark Complete), Delete habits.
- **Streak Tracking**: Automatically increments streaks based on daily completion.
- **AI Suggestions**: Mocked AI endpoint to suggest habits based on user goals.
- **Clean Architecture**: MVC pattern with separated concerns.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local or Atlas URI)

## Setup Instructions

1.  **Clone the repository** (if applicable) or navigate to the project folder.
2.  **Install dependencies**:
    ```bash
    npm install
    ```
3.  **Configure Environment**:
    - The `.env` file is pre-configured with defaults:
      ```
      PORT=5000
      MONGO_URI=mongodb://localhost:27017/habit-tracker
      ```
    - Update `MONGO_URI` if you are using a cloud database or a different local instance.

4.  **Start the Server**:
    - For development (with nodemon):
      ```bash
      npm run dev
      ```
    - For production:
      ```bash
      npm start
      ```

5.  **Run Tests**:
    ```bash
    npm test
    ```

## API Endpoints

### Habits

-   **GET /habits**
    -   List all habits.
-   **POST /habits**
    -   Create a new habit.
    -   Body: `{ "name": "Habit Name" }`
-   **PATCH /habits/:id/complete**
    -   Mark a habit as completed for today.
    -   Increments streak if completed on consecutive days.
-   **DELETE /habits/:id**
    -   Delete a habit.

### AI Suggestions

-   **POST /suggest-habits**
    -   Get habit suggestions based on a goal.
    -   Body: `{ "goal": "Fitness" }`
    -   Returns: `{ "suggestions": ["...", "...", "..."] }`

## Assumptions

-   **Authentication**: Not required for this mini-assignment.
-   **Database**: MongoDB is available.
-   **AI**: The AI response is mocked as per the "Optional AI (bonus)" requirement to avoid external API keys/costs.
-   **Timezone**: Dates are handled in UTC/Server time.

## Bonus Features

-   **AI Integration**: Implemented `/suggest-habits` endpoint.
-   **Streak Logic**: Implemented logic to handle streak increments and resets (basic logic).
