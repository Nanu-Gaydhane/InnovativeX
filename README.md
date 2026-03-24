# 🚀 RozgaarSetu

**RozgaarSetu** is a hyperlocal gig marketplace that connects daily wage workers (plumbers, electricians, painters, laborers) with customers for same-day jobs — without any middleman or commission.

---

## 📌 Problem Statement

Daily wage workers often spend hours at local nakas waiting for work with no guarantee of income.
They lack digital visibility, leading to wasted time and unstable earnings.

---

## 💡 Solution

RozgaarSetu provides a platform where:

* Workers can register with their skills and availability
* Customers can post same-day jobs
* Jobs are matched based on location
* Direct communication happens via WhatsApp or call

---

## 🎯 Key Features

### 👷 Worker Side

* Mobile-based login (OTP simulated)
* Profile creation with skills & experience
* Availability toggle (Available / Busy)
* View nearby jobs
* Apply via WhatsApp / Call
* Ratings & verification badge

### 🏠 Customer Side

* Post job with budget, location, urgency
* View nearby workers
* Filter by skills
* Direct contact (WhatsApp / Call)
* Mark job as completed

### 🛠️ Admin Panel

* View all users and jobs
* Verify workers
* Remove fake entries

---

## 📍 Core Functionalities

* 📌 Geo-based job matching (location filtering)
* 💬 WhatsApp integration (instant communication)
* ⭐ Ratings & trust system
* ✅ Verified worker badges
* ⚡ Same-day job matching

---

## 🛠️ Tech Stack

### Frontend

* React (Vite)
* Tailwind CSS
* React Router

### Backend

* Node.js
* Express.js

### Database

* MongoDB (GeoJSON for location)

### Other Integrations

* Browser Geolocation API
* WhatsApp API (wa.me links)

---

## 📂 Project Structure

```
/project-root
  /frontend
    /src
      /pages
      /components
      /services
      /context
      /hooks
      /utils

  /backend
    /controllers
    /routes
    /models
    /middleware
    /config
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```
git clone https://github.com/your-username/rozgaarsetu.git
cd rozgaarsetu
```

### 2. Setup Frontend

```
cd frontend
npm install
npm run dev
```

### 3. Setup Backend

```
cd backend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in backend:

```
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

---

## 🚀 Future Scope

* AI-based job matching
* Multi-language support (Hindi/Marathi)
* Voice-based interaction
* Real-time notifications
* Government integration

---

## 📈 Impact

* Reduces idle time for workers
* Increases daily earning opportunities
* Digitizes informal workforce
* Builds a trust-based ecosystem

---

## 🤝 Contributing

Contributions are welcome! Feel free to fork and improve the project.

---

## 📜 License

This project is developed for hackathon/demo purposes.

---

## 👨‍💻 Team

Built with ❤️ during a hackathon to solve real-world employment challenges.
