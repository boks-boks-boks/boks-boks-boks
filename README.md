# Boks-Boks-Boks

**Your comprehensive solution for organizing and managing storage boxes.**

Boks-Boks-Boks is a modern web application that helps you keep track of your belongings, categorize items, and never lose track of your stored items again. Whether you're organizing your garage, managing inventory, or simply keeping track of seasonal items, this app provides an intuitive interface to manage your storage boxes and their contents.

## What's Boks-Boks-Boks?

Boks-Boks-Boks is a storage management system that allows you to:

- **📦 Create and manage storage boxes** - Organize your belongings into virtual boxes (e.g., "Kitchen Items", "Winter Clothes", "Office Supplies")
- **📝 Track items with quantities** - Add items to your boxes with specific quantities to know exactly what you have
- **🏷️ Label and categorize** - Use a powerful labeling system with custom colors and descriptions to organize items
- **🔍 Search and filter** - Quickly find any item across all your boxes with powerful search capabilities
- **👤 User management** - Secure authentication system with personal storage spaces
- **📱 Responsive design** - Works seamlessly on desktop, tablet, and mobile devices

Perfect for home organization, small business inventory, moving preparation, or any scenario where you need to track items stored in physical containers.

## Requirements

- **Node.js**: Version 24.4 or higher (LTS recommended)
- **npm**: Version 10 or higher (comes with Node.js)
- **Modern web browser**: Chrome, Firefox, Safari, or Edge (latest versions)

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/boks-boks-boks/boks-boks-boks.git
cd boks-boks-boks
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 4. Open in browser

```bash
# Or start the server and open the app in a new browser tab
npm run dev -- --open
```

### Production Build

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with:

```bash
npm run preview
```

### Using Docker

The project includes Docker support for easy deployment:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

The application will be available at `http://localhost` (port 80).

## How to Use

### Getting Started

1. **Register/Login**: Create an account or sign in to access your personal storage space
2. **Create Your First Box**: Click "Create Your First Box" and give it a descriptive name
3. **Add Items**: Navigate to your box and start adding items with quantities
4. **Organize with Labels**: Create custom labels with colors to categorize your items
5. **Search and Manage**: Use the search functionality to quickly find items across all boxes

### Key Features

#### Box Management

- Create boxes with descriptive names (e.g., "Garage Storage", "Holiday Decorations")
- Edit box titles and details
- Delete boxes when no longer needed
- View box statistics (item count, etc.)

#### Item Management

- Add items with titles and quantities
- Edit item details and quantities
- Assign multiple labels to items
- Delete items from boxes
- Track item amounts accurately

#### Label System

- Create custom labels with:
  - Descriptive titles
  - Detailed descriptions
  - Custom color coding
- Assign labels to items for better organization
- Visual identification with color-coded labels

#### Search & Organization

- Browse all your boxes from the dashboard
- Navigate through items within each box
- Visual indicators for empty boxes
- Breadcrumb navigation for easy browsing

## Tech Stack

- **Frontend**: SvelteKit 2.x with TypeScript
- **Styling**: TailwindCSS with custom components
- **Authentication**: JWT-based with secure password hashing
- **State Management**: Svelte stores for reactive state
- **Build Tool**: Vite
- **Deployment**: Docker with Caddy reverse proxy
- **Package Manager**: npm

## Author

This project is entirely made by me (ASTOLFI Vincent). I suggest you to check on my github profile if you want to see the other project I've done for my studies or the ones I do in my free time. 

## See also 

backend of this project : [boks-boks-boks/api](https://github.com/boks-boks-boks/api)