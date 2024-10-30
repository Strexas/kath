# Development Server Setup Guide

This guide provides instructions on setting up and running a Vite-based development server using React and TypeScript.

## Prerequisites

1. **Node.js**
2. **Visual Studio Code (VS Code)** 

## Step 1: Install Node.js and npm

1. **Check Node.js version:**:
    ```bash
    node -v
    ```

    Ensure you have Node.js installed. You can download it from [here](https://nodejs.org/).

2. **Check npm version:**:
    ```bash
    npm -v
    ```
    
    If npm is not installed, it will be installed automatically with Node.js.

## Step 2: Set Up Your Development Environment

1. **Open VS Code:**:
    - Install Visual Studio Code if you haven’t already. Download it from [here](https://code.visualstudio.com/).

2. **Open Your Project Folder:**
   - In the VS Code window, open the Command Palette again (`Ctrl+Shift+P`).
   - Type `>File: Open Folder...` and navigate to your project folder located on Windows. Open whole github repository (root).

3. **Navigate to front-end application:**
    - Press `` Ctrl+Shift+` `` to open the New Terminal. Then navigate to:

    ```bash
    cd app/front_end
    ```

4. **Install Dependencies:**

    ```bash
   npm install
   ```

## Step 3: Run the Development Server
   ```bash
   npm run dev
   ```

   This will run the React application with Vite on `http://localhost:5173/`. To shutdown the application press `Ctrl+C` in VS Code terminal.