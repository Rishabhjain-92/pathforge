# PathForge: n8n Integration & Docker Deployment Guide

Welcome to the **PathForge Automation Guide**! This document explains how to set up, run, and deploy the entire containerized stack—including our React frontend, Node/Express backend, **n8n Workflow Automation**, and a PostgreSQL instance—either locally or on a free AWS EC2 server.

---

## 🚀 Architectural Overview

By orchestrating our stack with Docker, we run four isolated services that communicate seamlessly:
1. **React Frontend (`client`)**: Served via a production-grade Nginx server on port `80`.
2. **Express Backend (`server`)**: Runs on Node.js on port `5000`, connected to MongoDB Atlas.
3. **n8n Automation Engine (`n8n`)**: Admin panel on port `5678`, orchestrating weekly tasks.
4. **PostgreSQL Database (`postgres`)**: Internal data store dedicated to saving your n8n workflow states.

```
       [ Client (Port 80) ] <---> [ Server (Port 5000) ] <---> [ MongoDB Atlas ]
                                       ^
                                       | (HTTP Trigger & Recalibrate)
                                       v
[ Postgres (n8n DB) ] <---------> [ n8n (Port 5678) ] ------> [ Student Email (SMTP) ]
```

---

## 💻 1. Local Quickstart (Development)

### Step A: Prepare Environment Variables
Before running Docker, you must populate your backend `.env` variables at the project root. Create a file named `.env` at the root directory of the project:

```bash
# Server API Configuration
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_signing_secret
GROQ_API_KEY=your_groq_api_key

# n8n Automation Authentication Key (invent a secure string here)
AUTOMATION_API_KEY=my_ultra_secure_automation_key_123

# Postgres DB for n8n (Defaults are automatically set if left blank)
N8N_DB_USER=n8n
N8N_DB_PASSWORD=n8n_secure_pass_123
N8N_DB_NAME=n8n
```

### Step B: Start the Containerized Stack
Ensure Docker Desktop is running on your machine, then execute the following command at your project root:

```bash
docker-compose up --build -d
```

* **Verify Boot Status**: Run `docker ps` to verify all four containers (`pathforge_client`, `pathforge_server`, `pathforge_n8n`, `pathforge_n8n_db`) are running.
* **Services URLs**:
  - Frontend Interface: [http://localhost](http://localhost)
  - Backend API Health Check: [http://localhost:5000](http://localhost:5000)
  - n8n Automation Panel: [http://localhost:5678](http://localhost:5678)

---

## ⚙️ 2. Setting Up n8n & Importing the Workflow

Once n8n is running locally or on the cloud:

1. **Access the Console**: Navigate to [http://localhost:5678](http://localhost:5678) (or your EC2 IP on port 5678) and create your initial admin account.
2. **Import the PathForge Workflow**:
   - In the left sidebar, click on **Workflows** -> **Add Workflow** (or click the plus icon).
   - In the top-right corner, click the **three dots menu (...)** and select **Import from File**.
   - Select the template file located at: `docs/n8n/weekly-recalibration.json`.
3. **Configure Headers & Credentials**:
   - Double-click the **Get Active Users** HTTP node. In the headers section, replace `your_secure_automation_api_key_here` with the value of the `AUTOMATION_API_KEY` defined in your `.env` file.
   - Double-click the **Call AI Recalibrate API** node and similarly update the `x-automation-key` header with the same API key.
   - Double-click the **Send Progress Email** node. Click on the **Credential** dropdown, choose **Create New Credential**, select **SMTP**, and input your email service details (e.g., Gmail APP Password, SendGrid SMTP credentials, or Mailgun).
4. **Activate the Automation**: Click **Save** in the top right, and slide the **Active** toggle in the top-right corner to **ON**. Your weekly recalibration is now automated!

---

## ☁️ 3. Deploying to AWS EC2 (12-Month Free Tier)

Ready to launch production-grade hosting? Here is how to configure a free AWS instance:

### Step 1: Launch an EC2 Instance
1. Log in to your **AWS Console** and search for **EC2**.
2. Click **Launch Instance**.
3. Name your instance (e.g. `PathForge-Prod`).
4. Select **Ubuntu Server 24.04 LTS (HVM)** as the Amazon Machine Image (AMI) (Free tier eligible).
5. For Instance Type, select **t2.micro** (or **t3.micro** if you are in a region where t3 is the default free option).
6. Generate or select a **Key Pair (.pem)** so you can SSH into the server safely.
7. Under **Network Settings / Security Group**:
   - Allow SSH traffic (Port `22`) from your IP.
   - Allow HTTP traffic (Port `80`) from Anywhere.
   - Allow custom TCP ports `5000` (Backend API) and `5678` (n8n admin console) from Anywhere.
8. Click **Launch**.

### Step 2: SSH into the Server & Install Docker
Open a terminal on your computer and connect to the public IP of your EC2 instance:

```bash
ssh -i "your-key-pair.pem" ubuntu@your-ec2-public-ip
```

Once connected, run this script to update the system and install Docker + Docker Compose:

```bash
# Update local repository indexes
sudo apt-get update && sudo apt-get upgrade -y

# Install Docker
sudo apt-get install -y docker.io docker-compose-v2

# Start and enable Docker on startup
sudo systemctl start docker
sudo systemctl enable docker

# Add ubuntu user to docker group (so you don't have to prepend "sudo" to every docker command)
sudo usermod -aG docker ubuntu
```

*Note: Exit the SSH connection (`exit`) and SSH back in to apply the group permissions.*

### Step 3: Clone Repository and Start Services
1. Clone your PathForge repository onto the EC2 server:
   ```bash
   git clone https://github.com/yourusername/PathForge.git
   cd PathForge
   ```
2. Create the production `.env` file inside the root folder:
   ```bash
   nano .env
   ```
   *(Paste your MongoDB Atlas strings, Groq API keys, and custom secrets. Press `CTRL+O` and `CTRL+X` to save and exit).*
3. Launch the containerized production stack:
   ```bash
   docker compose up -d --build
   ```

That is it! Your application is live at `http://your-ec2-public-ip`, your backend is serving API requests at `http://your-ec2-public-ip:5000`, and you can log in to manage your automated flows at `http://your-ec2-public-ip:5678`!

---

## 🔒 4. Security Best Practices
- **Never commit `.env` files**: We have configured `.gitignore` to block them, ensuring credentials stay private.
- **n8n Basic Auth**: In production, we highly recommend adding a username/password directly in the n8n container configurations in `docker-compose.yml` to prevent unauthorized web access:
  ```yaml
  environment:
    - N8N_BASIC_AUTH_ACTIVE=true
    - N8N_BASIC_AUTH_USER=admin
    - N8N_BASIC_AUTH_PASSWORD=your_highly_secure_password
  ```
- **X-Automation-Key**: Ensure `AUTOMATION_API_KEY` is a long, randomly generated cryptographic key to keep malicious entities from triggering recalculation loops.
