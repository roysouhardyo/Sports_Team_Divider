# Team Divider - Football Team Generator

A modern, full-stack web application for creating balanced football teams based on player ratings and positions. Built with Next.js, Tailwind CSS, MongoDB Atlas, and Framer Motion.

## Features

- **Player Management**: Add, edit, and delete players with name, rating (1-100), and position (GK, DF, MF, FW)
- **Smart Search**: Autocomplete search functionality with real-time suggestions
- **Balanced Team Generation**: Advanced algorithm that creates evenly matched teams
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Updates**: Instant feedback and smooth transitions

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Animations**: Framer Motion
- **Database**: MongoDB Atlas with Mongoose ODM
- **Deployment**: Vercel-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB Atlas account
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd team-divider
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=your_mongodb_atlas_connection_string
   ```

   To get your MongoDB Atlas connection string:
   - Go to [MongoDB Atlas](https://cloud.mongodb.com)
   - Create a new cluster or use existing one
   - Click "Connect" → "Connect your application"
   - Copy the connection string and replace `<password>` with your database password

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   
   Live Preview [https://sports-team-divider.vercel.app/](https://sports-team-divider.vercel.app/)

## Usage

### Adding Players
1. Go to the home page
2. Click "Add New Player" or use the search bar to find existing players
3. Fill in the player's name, rating (1-100), and position
4. Click "Add Player"

### Creating Teams
1. Search for players using the autocomplete search
2. Add players to your selection
3. Once you have at least 2 players, click "Generate Balanced Teams"
4. View your balanced teams with total ratings

### Managing Players
1. Navigate to the "Manage Players" page
2. View all players in your database
3. Edit player information by clicking the edit icon
4. Delete players by clicking the delete icon

## Team Generation Algorithm

The app uses a sophisticated algorithm to create balanced teams:

1. **Sort by Rating**: Players are sorted by rating (highest first)
2. **Randomization**: Small random factors are added to prevent predictable team assignments
3. **Alternate Assignment**: Players are assigned to the team with the lower total rating
4. **Balance Check**: The algorithm ensures minimal rating difference between teams

## API Endpoints

- `GET /api/players` - Fetch all players
- `POST /api/players` - Add new player
- `PUT /api/players/:id` - Update player
- `DELETE /api/players/:id` - Delete player
- `GET /api/search?query=abc` - Search players by name
- `POST /api/generate` - Generate balanced teams

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add environment variable `MONGODB_URI` with your MongoDB Atlas connection string
   - Deploy

3. **Environment Variables in Vercel**
   - Go to your project settings in Vercel
   - Add `MONGODB_URI` with your MongoDB Atlas connection string
   - Redeploy if needed

## Project Structure

```
team-divider/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── manage/            # Manage players page
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout
│   └── page.js            # Home page
├── components/            # React components
│   ├── Header.js          # Navigation header
│   ├── PlayerCard.js      # Player display card
│   ├── SearchBar.js       # Search with autocomplete
│   └── TeamCard.js        # Team display card
├── lib/                   # Utility functions
│   └── mongodb.js         # Database connection
├── models/                # Database models
│   └── Player.js          # Player schema
└── public/                # Static assets
```

## Customization

### Colors
The app uses a custom color palette defined in `tailwind.config.js`:
- Primary: Green shades for football theme
- Dark: Gray shades for contrast
- Position-specific colors for player positions

### Animations
All animations are powered by Framer Motion and can be customized in the component files.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

If you encounter any issues or have questions, please open an issue on GitHub.
