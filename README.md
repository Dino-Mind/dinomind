# Chrome Extension: Gemini Nano Assistant

Gemini Nano Assistant is a smart Chrome extension designed to enhance your browsing experience by leveraging user habits and interests. Whether you’re online or offline, Gemini Nano Assistant provides personalized insights, tips, and resources tailored to your preferences, helping you get the most out of Chrome.

## Features

- **Personalized Side Panel**: Access an intuitive side panel with content based on your browsing habits and interests. It includes relevant resources, shortcuts, and suggestions that complement your Chrome browsing experience.
- **Gemini Nano AI Integration**: Powered by Gemini Nano AI, this extension adapts to your usage patterns to offer insightful recommendations and helpful guidance, streamlining your time spent online.
- **Offline Mode Support**: Continue accessing pre-curated content in offline mode, including articles, resources, and guides that align with your interests. Enjoy an uninterrupted experience, even when not connected to the internet.
- **User-Centric Suggestions**: Gemini Nano Assistant learns from your browsing habits to refine the suggestions it offers, constantly adapting to meet your unique needs and help you stay focused.
- **Smart Toolbar Integration**: A smart toolbar button lets you easily open and close the Gemini Nano Assistant side panel, putting insights and tools just a click away.

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/gemini-nano-assistant.git
   cd gemini-nano-assistant
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the extension**:
   ```bash
   npm run dev
   ```

4. **Load the extension in Chrome**:
   - Go to `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `dist` folder in the project directory.

## How It Works

### Side Panel
- The extension features a side panel powered by the Chrome Side Panel API, which opens directly within the browser interface.
- The panel displays personalized content based on your usage, using data handled securely by Gemini Nano AI.

### Content Personalization
- The extension observes general browsing habits (with user permission) to determine relevant content, helping you find useful resources faster.
- When offline, the side panel continues to serve content that matches your interests, stored locally for easy access.

### Smart Toolbar Button
- Open and close the Gemini Nano Assistant side panel using the toolbar button.
- The toolbar badge displays the number of new recommendations or updates available in the panel.

## Permissions

This extension requires the following permissions:
- **sidePanel**: To display the custom side panel alongside Chrome.
- **tabs**: To understand which tabs are open and provide tailored insights.
- **storage**: To store user preferences and offline content.

## Technologies Used

- **React** for UI development.
- **Vite** for fast, optimized bundling.
- **Gemini Nano AI** for intelligent content recommendations and habit learning.
- **Chrome Extensions Manifest V3** for modern API support and secure data handling.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
