<a name="readme-top"></a>

<div align="center">
<img width="200px" src="public/veggify-logo.jpg" alt="VeggifyAI Logo">
</div>

<h1 align="center">VeggifyAI<br/><span style="font-size:10px;">An AI-Powered Nutrition Companion</span></h1>

<div align="center">

![Badge](https://img.shields.io/badge/AI-OpenAI-blue)
![Badge](https://img.shields.io/badge/Database-Firestore-orange)
![Badge](https://img.shields.io/badge/Framework-React-purple)
![Badge](https://img.shields.io/badge/Styling-Tailwind-green)
![Badge](https://img.shields.io/badge/Version-1.0-yellow)

</div>

## Tech Stack
<span>
<img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white"/>
<img src="https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white"/>
<img src="https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB"/>
<img src="https://img.shields.io/badge/Firebase-039BE5?style=for-the-badge&logo=Firebase&logoColor=white"/>
<img src="https://img.shields.io/badge/openai-412991?style=for-the-badge&logo=openai&logoColor=white"/>
</span>

- **Frontend:** React, Tailwind CSS, Vite
- **Backend:** Node.js, Express
- **Database:** Firebase Firestore
- **AI Service:** OpenAI API
- **Authentication:** Firebase Auth
- **Build Tool:** Vite

<br/>

<h3 align="center"> Your Personal Nutrition Assistant </h3> 
<hr>

# Table of Contents
<details>
<summary>Click to expand</summary>

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Core Functionality](#core-functionality)
- [Installation](#installation)
- [Future Scope](#future-scope)
- [License](#license)
</details>

## Overview
VeggifyAI revolutionizes dietary management through AI-powered personalized nutrition planning. The system addresses critical gaps in existing solutions by offering:
- Dynamic recipe generation accommodating allergies/chronic conditions
- Integrated goal tracking with progress analytics
- Smart shopping list automation
- Secure health profile management

## Project Screenshots

<div align="center">
  
<img src="public/6.png" alt="Shopping List" width="400"/>
<img src="public/7.png" alt="Mobile View" width="400"/>
<img src="public/8.png" alt="User Profile" width="400"/>
<img src="public/1.png" alt="Home Page" width="400"/>
<img src="public/2.png" alt="Dashboard" width="400"/>
<img src="public/3.png" alt="Recipe Generator" width="400"/>
<img src="public/4.png" alt="Recipe Details" width="400"/>
<img src="public/5.png" alt="Nutrition Tracking" width="400"/>
</div>

## Key Features

### Personalized Nutrition
- AI-generated recipes based on dietary needs
- Allergy and health condition filtering
- Nutritional goal tracking

### User Management
- Secure authentication (Google/Email)
- Health profile storage
- Preference management

### Shopping Integration
- Automated grocery list generation
- Real-time synchronization
- Cross-device availability

## System Architecture

### Frontend Components
- Recipe Generator Interface
- User Profile Dashboard
- Goal Tracking System
- Shopping List Manager

### Backend Services
- Recipe Generation API
- User Authentication Service
- Data Storage Layer
- Real-time Sync Engine

## Installation Guide

### Prerequisites
- Node.js (v16+)
- Firebase project
- OpenAI API key

### Setup Instructions
   Create a .env file
   ```bash
   REACT_APP_API_KEY=your_key_here
   OPENAI_API_KEY=your_key_here
   ```
1. Clone the repository and navigate to folder and then install dependencies:
   ```bash
   git clone https://github.com/yourrepo/veggifyai.git
   cd veggifyai or cd VeggifyAI
   npm install
   ```
   
2. Navigate to backend (server folder)
   ```bash
   cd server
   npm run start
   ```
   
3. Then,Start the frontend
   ```bash
   npm run dev
   ```
   
   
## Core Functionality

### Recipe Generation
1. User inputs preferences (ingredients, meal type, cuisine)
2. System processes with OpenAI API
3. Returns allergy-safe, nutritionally balanced recipes
4. Displays in clean Markdown format
