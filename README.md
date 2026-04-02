# 📒 School Fee Tracker

A lightweight student fee collection tracker with MongoDB backend. Works on any device — data syncs across all browsers.

## Tech Stack
- **Frontend:** React + Vite
- **Backend:** Vercel Serverless Functions
- **Database:** MongoDB Atlas (free tier)

---

## Setup Guide (15 minutes)

### Step 1: Create a Free MongoDB Atlas Database

1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas/register) and create a free account
2. Click **"Build a Database"** → Choose **M0 Free** tier
3. Pick any cloud provider/region (AWS + closest region works fine)
4. Set a **username** and **password** (save these — you'll need them)
5. Under **Network Access** → Click **"Add IP Address"** → Select **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is needed so Vercel's servers can connect
6. Go to **Database** → Click **"Connect"** → Choose **"Drivers"**
7. Copy the connection string — it looks like:
   ```
   mongodb+srv://youruser:yourpassword@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `yourpassword` in the string with your actual password

### Step 2: Push Code to GitHub

```bash
cd fee-tracker
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/school-fee-tracker.git
git push -u origin main
```

### Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"** → Import your `school-fee-tracker` repo
3. Before clicking Deploy, expand **"Environment Variables"** and add:
   - `MONGODB_URI` = your connection string from Step 1
   - `MONGODB_DB` = `school_fee_tracker`
4. Click **Deploy**
5. Done! Your app is live at `your-project.vercel.app`

### Step 4: Bookmark & Use

- Open the Vercel URL on your phone and bookmark it
- Share the same URL with staff — everyone sees the same data
- Works on any device with a browser

---

## Project Structure

```
fee-tracker/
├── api/                    # Vercel serverless functions
│   ├── _db.js              # MongoDB connection (shared)
│   ├── students/
│   │   ├── index.js        # GET all / POST new student
│   │   └── [id].js         # PUT update / DELETE student
│   └── payments/
│       ├── index.js        # GET by month / POST new payment
│       └── [id].js         # DELETE payment
├── src/
│   ├── main.jsx            # React entry
│   └── App.jsx             # Main app component
├── index.html
├── package.json
├── vite.config.js
├── vercel.json
└── .env.example
```

## API Endpoints

| Method | Endpoint              | Description            |
|--------|-----------------------|------------------------|
| GET    | /api/students         | List all students      |
| POST   | /api/students         | Add a student          |
| PUT    | /api/students/:id     | Update a student       |
| DELETE | /api/students/:id     | Delete student + payments |
| GET    | /api/payments?month=&year= | Get payments for month |
| POST   | /api/payments         | Record a payment       |
| DELETE | /api/payments/:id     | Delete a payment       |

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Create .env file with your MongoDB URI
cp .env.example .env
# Edit .env with your actual connection string

# 3. Run with Vercel CLI (to test API routes locally)
npm i -g vercel
vercel dev
```

Opens at `http://localhost:3000`
