# Kath UI Repository

Welcome to the Kath UI repository! This repository contains the front-end and back-end code for the Kath project.

## Front-end

The front-end is built with Vite, a next-generation frontend tooling. To run the front-end, follow these steps:

1. Navigate to the `front-end` directory:

   ```
   cd front-end
   ```

2. Install dependencies using npm:

   ```
   npm install
   ```

3. Run the development server:
   ```
   npm run dev
   ```

This will start the development server and open the application in your default web browser at [http://localhost:3000](http://localhost:3000).

## Back-end

The back-end is built with Flask, a lightweight WSGI web application framework. To run the back-end, follow these steps:

1. Navigate to the `back-end` directory:

   ```
   cd back-end
   ```

2. Create a virtual environment (venv):

   ```
   python -m venv venv
   ```

3. Activate the virtual environment:

   - On Windows:
     ```
     venv/Scripts/activate
     ```
   - On macOS/Linux:
     ```
     source venv/bin/activate
     ```

4. Once the virtual environment is activated, install dependencies using pip:

   ```
   pip install -r requirements.txt
   ```

5. Select the interpreter from the virtual environment in your code editor or IDE:

   - [VS Code](https://code.visualstudio.com/docs/python/environments): Click on the interpreter version in the bottom right corner and select the one from the `venv` directory.

6. Run the Flask application:
   ```
   python main.py
   ```

This will start the Flask development server, and your back-end will be up and running.

The back-end will be accessible at [http://localhost:8080](http://localhost:8080).
