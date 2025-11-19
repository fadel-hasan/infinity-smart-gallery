# Nano Banana Gallery 🍌∞

**The Infinite Archive.**

Nano Banana Gallery is a conceptual web application that simulates an endless, pre-existing photo database. While it creates images in real-time using Google's **Gemini 2.5 Flash Image** model, the user experience is designed purely around "Discovery" and "Retrieval." 

Users don't "generate" images here; they "find" them in the latent space.

## ✨ Key Features

*   **Endless Gallery**: The application features an infinite scrolling system. When you reach the bottom of a collection, the "system" automatically "retrieves" (generates) more assets matching the current context.
*   **Smart Indexing (AI Librarian)**: 
    *   When a user searches for a term (e.g., "A red Ferrari"), the app uses **Gemini 2.5 Flash** (Text) to analyze the subject.
    *   It automatically categorizes the request (e.g., creates a "Cars" category) rather than dumping it into a generic folder.
    *   If the category exists, it navigates you there. If it's new, it creates it.
*   **The "Darkroom" Editor**: A built-in image editor that allows users to retouch images using natural language prompts (e.g., "Add a retro filter", "Remove the background").
*   **Persistent Archive**: Uses `LocalStorage` to simulate a database. Your "found" images and created categories persist across page reloads.
*   **Immersive UI**: A dark-themed, sleek interface built with Tailwind CSS that mimics high-end stock photography sites.

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Models**: 
    *   `gemini-2.5-flash-image` (Image Generation & Editing)
    *   `gemini-2.5-flash` (Prompt Classification & Logic)
*   **SDK**: `@google/genai`
*   **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites

1.  Node.js installed.
2.  A Google Cloud / AI Studio API Key with access to Gemini 2.5 models.

### Installation

1.  **Clone the repository** (or download the source files).
2.  **Install dependencies**:
    ```bash
    npm install
    ```
    *Note: Ensure you have `react`, `react-dom`, `@google/genai`, and `lucide-react` installed.*

3.  **Configure API Key**:
    The application expects the API key to be available via `process.env.API_KEY`.
    
    Create a `.env` file in the root:
    ```env
    API_KEY=your_google_genai_api_key_here
    ```

4.  **Run the Application**:
    ```bash
    npm run dev
    ```

## 🧠 How It Works

### The "Search" Illusion
1.  **User Input**: The user types "Cyberpunk city" into the search bar.
2.  **Classification**: The app sends this text to the text-only Gemini model with the instruction: *"You are an archive librarian. Classify this prompt into a generic Category."*
3.  **Routing**:
    *   **Existing Category**: If the user searches for "Trees" and a "Nature" category exists with images, the app simply navigates the user to that view.
    *   **New Category**: If the user searches "Alien Spaceship," the AI creates a "Sci-Fi" category (if strictly needed) or a specific "Aliens" category, switches the view, and begins generation.
4.  **Generation**: The app calls `gemini-2.5-flash-image` to create the visual assets, but the UI displays "Retrieving assets from deep storage..." to maintain the immersion.

## 📂 Project Structure

*   `App.tsx`: Main controller. Handles routing, infinite scroll logic, and state management.
*   `services/geminiService.ts`: Handles all interaction with the Google GenAI SDK (Generation, Editing, and Classification).
*   `services/storageService.ts`: Manages saving/loading the "Archive" from LocalStorage.
*   `components/`:
    *   `LandingPage.tsx`: The "Sales" page explaining the infinite archive concept.
    *   `Editor.tsx`: The interface for modifying images.
    *   `ImageCard.tsx`: Displays individual assets with download/edit options.
    *   `NavBar.tsx`: Global navigation.

## 📄 License

This project is an open-source demonstration of the Gemini API capabilities.
