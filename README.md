<div align="center">
  <img src="public/logo.svg" alt="SAKU Logo" width="120" />
  <h1>SAKU - Personal Finance Tracker</h1>
  <p>Track your money, see where it goes. Full privacy control in your hands.</p>
  
  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" alt="Tailwind CSS" /></a>
    <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" /></a>
    <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript" alt="TypeScript" /></a>
  </p>
</div>

<br />

## ✨ Core Features

- 🌍 **Multi-language Support:** Natively available in both English and Indonesian.
- 🌓 **Auto Dark Mode:** Seamlessly switch between elegant light and dark themes based on your system preference.
- 📊 **Sharp Analytics:** Interactive charts to monitor your spending habits down to the last penny.
- 🎯 **Savings Goals:** Plan for vacations, gadgets, or emergency funds with visual progression.
- 🤝 **Debt Tracker:** Keep transparent track of who owes you and who you owe.
- 💸 **Disciplined Budgeting:** Set category limits and avoid overspending with smart alerts.
- 🔒 **Maximum Privacy:** Secured via Supabase RLS and industry-standard encryption.

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/MhdFarhan17/SAKU.git
cd SAKU
```

### 2. Install dependencies
```bash
npm install
# or yarn install / pnpm install
```

### 3. Setup Supabase Database
Create a `.env.local` file in the root directory and add your Supabase credentials:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Execute the SQL scripts located in the `supabase/migrations` folder directly inside your Supabase SQL Editor to set up the database schema and security policies.

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to experience the application.

## 🌐 Deploy on Vercel

Deploy your own SAKU instance for free in one click using Vercel.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FMhdFarhan17%2FSAKU&env=NEXT_PUBLIC_SUPABASE_URL,NEXT_PUBLIC_SUPABASE_ANON_KEY)

---
<div align="center">
  <b>Made with ❤️ in Indonesia by <a href="https://github.com/MhdFarhan17">MhdFarhan17</a></b>
</div>
