# Dinomind

Dinomind is a smart Chrome extension designed to enhance your browsing experience by leveraging user habits and interests. Whether you’re online or offline, Gemini Nano Assistant provides personalized insights, tips, and resources tailored to your preferences, helping you get the most out of Chrome.

## Inspiration

Styled as a homage to Chrome's classic offline "Lonely T-Rex" game, this extension reimagines the concept with a futuristic twist. While the T-Rex now races against meteors to protect its kind, the design symbolizes a forward-thinking vision for Chrome's capabilities. With sleek, meteor-inspired animations, the extension blends nostalgia with innovation, offering a visually captivating experience that aligns with the evolving role of Chrome in the modern browsing landscape.


## Video Demonstration

[![Watch the video](https://img.youtube.com/vi/bcCTZNDeJqg/0.jpg)](https://youtu.be/bcCTZNDeJqg)


## Features

- **Personalized Side Panel**: Access an intuitive side panel with content based on your browsing habits and interests. It includes relevant resources, shortcuts, and suggestions that complement your Chrome browsing experience.
- **Recommendation System**: Features a recommendation system based on likes, ensuring tailored content and personalized tag suggestions.
- **Content-Specific Chat**: Dive deeper into content topics with AI-powered, content-specific chat features, offering dynamic and interactive conversations.
- **Gemini Nano AI Integration**: Powered by Gemini Nano AI, this extension adapts to your usage patterns to offer insightful recommendations and helpful guidance, streamlining your time spent online.
- **Offline Mode Support**: Continue accessing pre-curated content in offline mode, including articles, resources, and guides that align with your interests.


## Installation

### **Enable Built-in AI in Chrome**
1. **Download Chrome Canary or Dev Channel Build**:  
   [Download Chrome Dev](https://www.google.com/chrome/dev/) for experimental features.
2. **Enable AI Features in Chrome Flags**:  
   - Navigate to `chrome://flags`.  
   - Search for **“Built-in AI”** and enable the relevant settings.  
   - Restart Chrome to apply changes.
3. **Download the Nano Model (If Required)**:  
   [How to enable Built in nano model](https://developer.chrome.com/docs/extensions/ai/prompt-api) for be able to use Gemini Nano AI features.

### **Load the Extension Locally**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Dino-Mind/dinomind.git
   cd dinomind
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the extension**:
   ```bash
   npm run dev
   ```

4. **Load the extension in Chrome Dev or Chrome Canary**:
   - Go to `chrome://extensions/`.
   - Enable **Developer Mode**.
   - Click **Load unpacked** and select the `dist` folder in the project directory.

## How It Works

### Side Panel
- The extension features a side panel powered by the Chrome Side Panel API, which opens directly within the browser interface.
- The panel displays personalized content based on your web usage, using data handled securely by Gemini Nano AI.

### Content Personalization
- The extension observes general browsing habits (with user permission) to determine relevant content, helping you find useful resources faster.
- When offline, the side panel continues to serve content that matches your interests, stored locally for easy access.

### Smart Toolbar Button
- Open and close the Gemini Nano Assistant side panel using the toolbar button.

## Permissions

This extension requires the following permissions:
- **sidePanel**: To display the custom side panel alongside Chrome.
- **tabs**: To understand which tabs are open and provide tailored insights.
- **storage**: To store user preferences and offline content.

## Technologies Used

- **React** for UI development.
- **Vite** for fast, optimized bundling.
- **Gemini Nano AI**: Intelligent content recommendations and habit learning.
- **Tailwind**: Clean, modern styling.
- **Chrome Extensions Manifest V3**: Modern API support and secure data handling.

## Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository.
2. Create a new branch.
3. Make your changes and commit them.
4. Submit a pull request for review.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
