# Tushar Mishra's Advanced Todo App

An interactive and feature-rich Todo application built with React, Vite, and Tailwind CSS.

## Features

- Add, complete, and delete todos
- Categorize todos by event type (Work, Personal, Study, Health, Other)
- Color-coded labels for easy identification of todo categories
- Delete confirmation to prevent accidental deletions
- Sound effects for adding and deleting todos
- Animated gradient background
- Responsive design
- Local storage persistence

## Technologies Used

- React
- Vite
- Tailwind CSS
- date-fns
- lucide-react

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later)

### Installation

1. Clone the repository
   ```
   git clone https://github.com/rm3390/React.git
   ```

2. Navigate to the project directory
   ```
   cd advanced-todo-app
   ```

3. Install dependencies
   ```
   npm install
   ```

4. Install Tailwind CSS
   ```
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

5. Configure Tailwind CSS
   Create a `tailwind.config.js` file in the root of your project with the following content:
   ```javascript
   /** @type {import('tailwindcss').Config} */
   export default {
     content: [
       "./index.html",
       "./src/**/*.{js,ts,jsx,tsx}",
     ],
     theme: {
       extend: {},
     },
     plugins: [],
   }
   ```

6. Add Tailwind directives to your CSS
   Create or update your `src/index.css` file with these directives:
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Running the Project

1. Start the development server
   ```
   npm run dev
   ```

2. Open your browser and visit `http://localhost:5173` to see the app running

3. To stop the server, press `Ctrl + C` in the terminal

### Building for Production

1. Create a production build
   ```
   npm run build
   ```

2. Preview the production build locally
   ```
   npm run preview
   ```

3. Open your browser and visit `http://localhost:4173` to see the production version of the app

## Usage

- Add a new todo by typing in the input field and selecting an event type from the dropdown menu
- Click the checkbox to mark a todo as complete
- Click the trash icon to delete a todo (you'll be prompted to confirm)
- Use the "Clear completed" button to remove all completed todos

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.


## Acknowledgements

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [date-fns](https://date-fns.org/)
- [lucide-react](https://lucide.dev/)

## Contact

Tushar Mishra - [tm3390782@gmail.com]

