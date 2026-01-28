# Number Guessing Game

A feature-rich, interactive Number Guessing Game built with HTML, CSS, and JavaScript. Challenge yourself to guess the secret number within limited attempts across various difficulty levels.

## 🎮 Features

-   **Multiple Difficulty Levels**:
    -   **Easy**: Range 1-10 (1 point)
    -   **Medium**: Range 1-50 (2 points)
    -   **Hard**: Range 1-100 (3 points)

-   **Adjustable Challenge**:
    -   Choose your attempts limit: **Easy** (5), **Medium** (3), or **Hard** (1) to earn more points.

-   **Profile System**:
    -   **Guest Mode**: Play instantly without saving long-term stats.
    -   **User Profiles**: Create multiple named profiles to save your **Best Score**.
    -   **Persistence**: Profiles and high scores are saved locally so you don't lose progress.

-   **Session Tracking**:
    -   Real-time tracking of **Score**, **Rounds Played**, **Wins**, and **Losses**.
    -   Session summary modal to review your current gaming session.

-   **Polished UI/UX**:
    -   Visual feedback with animations (shake on wrong guess, success effects).
    -   Responsive design for desktop and mobile.
    -   Keyboard accessibility and screen reader support.

## 🚀 How to Play

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/subitbhoi/Number-Guessing-Game.git
    cd "Number Guessing Game"
    ```
2.  Open `index.html` in your web browser.
3.  **Select a Difficulty**: Choose the range of numbers (Easy, Medium, Hard).
4.  **Select Attempts**: Choose how many tries you want allowed.
5.  **Start Guessing**: Enter a number and hit "Guess".
    -   If you guess correctly, you win points!
    -   If wrong, you'll get a hint (Too High / Too Low).
6.  **Manage Profiles**: Click the profile name (default: Guest) to switch or create a new user to save your high scores.

## 📂 Project Structure

```
Number Guessing Game/
│
├── index.html          # Main game interface
├── assets/
│   ├── css/
│   │   └── style.css   # Game styling and animations
│   └── js/
│       └── script.js   # Game logic, state management, and storage
└── README.md           # Project documentation
```

## 🛠️ Technologies Used

-   **HTML5**: Semantic structure.
-   **CSS3**: Flexbox layouts, custom animations, and responsive design.
-   **JavaScript (ES6+)**:
    -   Object-Oriented Programming (Classes).
    -   `localStorage` for persistent profiles.
    -   `sessionStorage` for temporary session stats.
    -   DOM manipulation and event handling.

## 👤 Author

**Subit Kumar Bhoi**

-   📧 Email: [bhoisubit@gmail.com](mailto:bhoisubit@gmail.com)
-   🐙 GitHub: [@subitbhoi](https://github.com/subitbhoi)

## 📄 License

This project is open for personal use and educational purposes.
