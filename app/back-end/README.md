# Development Server Setup Guide

This guide provides instructions on setting up and running a Flask-based development server using Gunicorn, Gevent, Socket.IO, CORS and Redis on a Windows operating system with WSL (Windows Subsystem for Linux).

## Prerequisites

1. **Windows 10 or 11**
2. **Visual Studio Code (VS Code)**

## Step 1: Install WSL

1. **Open PowerShell**:
   - Search for `PowerShell` in the Start menu, right-click, and select `Open`.

2. **Install WSL**:
   ```powershell
   wsl --install
   ```

   This will install WSL and the default Ubuntu distribution. You may need to restart your computer after installation.

3. **Set Up Ubuntu**
   - Complete the setup by creating a new user and password.

## Step 2: Running WSL

1. **Open PowerShell**:
   - Search for `PowerShell` in the Start menu, right-click, and select `Open`.

2. **Run WSL**:
   ```powershell
   wsl -d ubuntu
   ```

   This will run WSL with the Ubuntu distribution.

## Step 3: Install Required Tools and Libraries in Ubuntu WSL

1. **Navigate to `~` Directory**:
   ```bash
   cd ~
   ```

   You should see something like `ubuntu_user@windows_user:~$`.

2. **Update Package List:**
   ```bash
   sudo apt-get update
   ```

   Wait for the system to update.

3. **Install Required Packages:**
   ```bash
   sudo apt-get install python3 python3-pip python3-venv redis
   ```

   With any prompts type `y` and press `enter`.

## Step 4: Set Up Your Development Environment

1. **Open VS Code:**:
   - Install Visual Studio Code if you haven’t already. Download it from [here](https://code.visualstudio.com/).

2. **Install WSL Extension:**
   - Open VS Code.
   - Go to the Extensions view by clicking the Extensions icon in the Activity Bar on the side of the window.
   - Search for `WSL` and install it.

3. **Open a WSL Terminal in VS Code:**
   - Press `Ctrl+Shift+P` to open the Command Palette.
   - Type `>WSL: Connect to WSL using Distro...` and select it to connect to WSL using VS Code.
      - If there are multiple distributions in your system, select `Ubuntu`.

4. **Open Your Project Folder:**
   - In the WSL-connected VS Code window, open the Command Palette again (`Ctrl+Shift+P`).
   - Type `>WSL: Open Folder in WSL...` and navigate to your project folder located on Windows. WSL can access your Windows files under `/mnt/c/`, so your project might be located at something like `/mnt/c/Users/YourUsername/Path/To/Project`.
      - To start navigation through files, type `/mnt/c/`.

5. **Install Essential VS Code Extensions on WSL**
   - With the WSL window open in VS Code, go to the Extensions view by clicking on the Extensions icon in the     Activity Bar on the side of the window.
   - Search and install the following extensions in WSL: Ubuntu:
     - **Python**: Provides rich support for the Python language, including features for linting, debugging, and code navigation.
     - **Black Formatter**: Integrates the Black code formatter into VS Code, ensuring your Python code is formatted consistently.
     - **Rainbow CSV**: Highlights CSV and TSV files with color coding, making it easier to view and edit tabular data.

## Step 5: Set Up the Python Environment

1. **Open VS Code Terminal Inside Your Project Directory:**
   - Press `` Ctrl+Shift+` `` to open the New Terminal.

2. **Navigate to Application:**
   ```bash
   cd app/back-end
   ```
   
   You should see something like `ubuntu_user@windows_user:/mnt/c/Users/YourUsername/Path/To/Project/app/back-end$`.

3. **Create a Python Virtual Environment:**
   ```powershell
   python3 -m venv .venv
   ```

   Wait for virtual environment to be created.

4. **Activate a Python Virtual Environment:**
   ```bash
   source .venv/bin/activate
   ```

   For deactivating virtual environment simply run `deactivate`.

5. **Install Python Dependencies:**
   ```powershell
   pip install -r requirements.txt
   ```

   Wait for the dependencies to be installed into virtual environment. To install additional development dependencies use:
   ```powershell
   pip install -r requirements_dev.txt
   ```

6. **Configure Python Interpreter:**
   - Open the Command Palette `Ctrl+Shift+P`, type `>Python: Select Interpreter`, and select the Python interpreter from your WSL virtual environment:
      - Select `Enter interpreter path...`
      - Select `Find...`
      - Open `/mnt/c/Users/YourUsername/Path/To/Project/app/back-end/.venv/bin/python3.10`

## Step 6: Run the Development Server

1. **Test if Redis is running:**
   ```bash
   redis-cli
   ```

   Test the connect with the `ping` command.
   ```powershell
   127.0.0.1:6379> ping
   PONG
   ```

   If you get this response `Could not connect to Redis at 127.0.0.1:6379: Connection refused`, exit out of the connection and start the Redis server.
   ```bash
   sudo systemctl start redis
   ```

   Now test it again.
   
   #
   
   ```bash
   sudo systemctl stop redis
   ```
   
   This will stop the Redis server.

2. **Download FASTA file for SpliceAI**
   ```powershell
   mkdir -p app/back-end/src/workspace/fasta && cd app/back-end/src/workspace/fasta && curl -O https://hgdownload.cse.ucsc.edu/goldenPath/hg38/bigZips/hg38.fa.gz && gunzip hg38.fa.gz
   ```
   This will download FASTA "hg38.fa" file that is required for correct work of SpliceAI

3. **Run the application**
   ```powershell
   gunicorn -c gunicorn_config.py run:app
   ```

   This will run the Flask application with Gunicorn. To shutdown the application press `Ctrl+C` in VS Code terminal.



   