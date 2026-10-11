# Mobile Accessories Website

A full-stack e-commerce storefront for a mobile accessories shop, featuring a public catalog and a secure admin panel for managing products and store content.

## Overview
This project provides a complete storefront experience for a mobile accessories business, including public browsing, product categories, brand details, contact information, and secure administrative management features.

## Features
- Public storefront with product catalog
- Category and brand browsing
- Contact information section
- JWT-protected admin dashboard
- Product management capabilities
- Clean user experience for e-commerce flows

## Tech Stack
- Next.js / React
- TypeScript
- Node.js / backend APIs
- JWT authentication
- Database integration

## Prerequisites
- Node.js 18+
- npm or yarn
- Database service (if configured)
- Environment variables for app configuration

## Getting Started
1. Clone the repository:
   ```bash
   git clone https://github.com/javaidgithub/mobile-accessories-website.git
   ```
2. Change into the project directory:
   ```bash
   cd mobile-accessories-website
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Create a `.env` file and configure required environment variables.
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Open the app in your browser.

## Project Structure
```text
mobile-accessories-website/
├── src/
├── public/
├── app/
├── components/
├── lib/
├── package.json
├── tsconfig.json
├── README.md
├── .gitignore
├── LICENSE
└── .env.example
```

## Admin Access
The admin panel is protected with JWT authentication. Ensure your environment variables and auth configuration are set up securely before deployment.

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
