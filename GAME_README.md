# 🌍 2048 Evolution 🚀

A modern twist on the classic 2048 game where you evolve civilization through time! Built with React Native, Expo, and TypeScript.

## 🎮 Game Features

### Evolution Stages
Progress through 8 stages of civilization:
- 🪨 **Stone** → Basic building block
- 🔥 **Fire** → Discovery of energy
- 🛖 **Hut** → First shelter
- 🏠 **House** → Advanced dwelling
- 🏙️ **City** → Urban development
- 🏢 **Skyscraper** → Vertical expansion
- 🛰️ **Satellite** → Space exploration
- 🪐 **Space Colony** → Interplanetary civilization

### Gameplay
- **4x4 Grid**: Classic 2048 board layout
- **Swipe Controls**: Intuitive touch gestures
- **Merge Mechanics**: Combine same stages to evolve
- **Scoring System**: Earn points for each evolution
- **Best Score Tracking**: Local storage of your highest achievement
- **Game Over Detection**: Automatic detection when no moves are possible
- **Smooth Animations**: React Native Reanimated for beautiful transitions

### UI/UX Features
- **Splash Screen**: Welcome screen with game introduction
- **How to Play**: Built-in instructions and rules
- **Score Display**: Real-time score and best score tracking
- **Game Over Modal**: Restart or return to home options
- **Themed Design**: Evolution-inspired visual design
- **Cross-Platform**: Works on iOS, Android, and Web

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   # or
   npx expo start
   ```

3. **Run on Platform**
   - **Web**: Press `w` in terminal or visit http://localhost:8081
   - **iOS**: Press `i` in terminal (requires Xcode)
   - **Android**: Press `a` in terminal (requires Android Studio)

## 🏗️ Project Structure

```
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Main game screen
│   │   └── _layout.tsx        # Tab navigation
│   └── _layout.tsx            # Root layout
├── components/
│   └── game/
│       ├── GameBoard.tsx      # 4x4 game grid with swipe detection
│       ├── TileComponent.tsx  # Individual tile with animations
│       ├── ScoreBoard.tsx     # Score display component
│       └── GameOverModal.tsx  # Game over dialog
├── constants/
│   └── game.ts               # Game constants and types
└── utils/
    └── gameLogic.ts          # Core game logic and mechanics
```

## 🎯 Game Rules

1. **Start**: Game begins with 2 random tiles (Stone stage)
2. **Move**: Swipe in any direction to move all tiles
3. **Merge**: When two tiles of the same stage collide, they merge into the next evolution stage
4. **Score**: Each merge awards points based on the evolution stage achieved
5. **New Tile**: After each move, a new Stone tile appears in a random empty space
6. **Win Condition**: Reach the highest evolution stage (Space Colony)
7. **Lose Condition**: No empty spaces and no possible merges

## 🎨 Technical Implementation

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript
- **React Native Reanimated**: Smooth animations
- **React Native Gesture Handler**: Touch gesture recognition
- **AsyncStorage**: Local data persistence
- **Expo Router**: File-based navigation

## 📱 Platforms Supported

- ✅ **iOS** (iPhone/iPad)
- ✅ **Android** (Phone/Tablet)  
- ✅ **Web** (Desktop/Mobile browsers)

## 🔧 Development

Run tests and checks:
```bash
# Lint code
npm run lint

# Test TypeScript compilation
npx tsc --noEmit

# Run game verification
node scripts/test-game.js
```

## 🎉 Features Roadmap

- [ ] Undo move functionality
- [ ] Power-ups and special tiles
- [ ] Multiple evolution paths (Nature, Technology, Food)
- [ ] Online leaderboards
- [ ] Sound effects and music
- [ ] Achievement system
- [ ] Multiplayer mode

---

**Built with ❤️ for the evolution of gaming!**