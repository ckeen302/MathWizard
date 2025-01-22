# Math Wizard

Math Wizard is an interactive web application that allows users to analyze and visualize mathematical expressions. It provides a user-friendly interface for performing various mathematical operations and graphing functions.

Live Site: https://v0-newton-ot65ium3hep.vercel.app 

## Features

- Perform various mathematical operations (simplify, factor, derive, integrate, etc.)
- Visualize expressions with an interactive graph
- Dark mode support
- LaTeX rendering for mathematical expressions
- Text-to-speech functionality for results
- History of previous calculations
- Responsive design for mobile and desktop
- Utilizes the Newton API for advanced mathematical operations

## Technologies Used

- React
- Next.js
- TypeScript
- Tailwind CSS
- Framer Motion for animations
- Desmos API for graphing
- KaTeX for LaTeX rendering
- Newton API for mathematical computations

## API Usage

This project uses two main APIs:

### Newton API

Used for mathematical computations. The API is free to use and doesn't require authentication. However, please be aware of rate limiting and fair usage policies.

- API Base URL: `https://newton.now.sh`
- API Documentation: [Newton API](https://github.com/aunyks/newton-api)

Note: If you plan to use this project in a production environment with high traffic, consider implementing your own mathematical computation server or using a more robust service.

### Desmos API

Used for graphing mathematical expressions. You need to sign up for an API key to use it in your project.

- API Documentation: [Desmos API](https://www.desmos.com/api/v1.7/docs/index.html)
- Sign up for API key: [Desmos API Key](https://www.desmos.com/api/v1.7/docs/index.html#document-api-keys)

## Installation and Setup

1. Clone the repository:
   \`\`\`
   git clone https://github.com/yourusername/math-wizard.git
   cd math-wizard
   \`\`\`

2. Install dependencies:
   \`\`\`
   npm install
   \`\`\`

3. Create a `.env.local` file in the root directory and add your Desmos API key:
   \`\`\`
   NEXT_PUBLIC_DESMOS_API_KEY=your_desmos_api_key_here
   \`\`\`

4. Run the development server:
   \`\`\`
   npm run dev
   \`\`\`

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Building for Production

To create a production build, run:

\`\`\`
npm run build
\`\`\`

Then, to start the production server:

\`\`\`
npm start
\`\`\`

## Deployment

This project is set up to be easily deployed on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your main branch.

Remember to add your `NEXT_PUBLIC_DESMOS_API_KEY` to your Vercel project's environment variables.

