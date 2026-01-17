# ChatGPT Question Sidebar

A Chrome extension that displays all questions from your ChatGPT conversation in a convenient sidebar. Click on any question to smoothly scroll to it in the conversation.

## Features

- 📋 **Question List Display**: Automatically displays all your questions from ChatGPT conversations in a sidebar
- 🎯 **Quick Navigation**: Click any question to smoothly scroll to it in the conversation
- 🔄 **Real-time Updates**: Automatically updates when new questions are added
- 📱 **Collapsible Sidebar**: Collapse the sidebar to save screen space (2 characters visible when collapsed)
- ✨ **Clean Design**: Transparent background that blends naturally with ChatGPT's UI

## Screenshots

Screenshots are available in the `screenshoots/` folder:
- Screenshot showing the sidebar on the right side of ChatGPT
- Collapsed sidebar view
- Question list interface

## Installation

1. Install from Chrome Web Store (coming soon)
2. Visit ChatGPT website (https://chat.openai.com or https://chatgpt.com)
3. The sidebar will automatically appear on the right side

## How to Use

1. Start a conversation on ChatGPT
2. Your questions will automatically appear in the sidebar on the right
3. Click any question to smoothly scroll to it
4. Click the `>>` button in the header to collapse the sidebar
5. Click `<<` to expand it again

## How It Works

1. **Content Script**: Automatically injected into ChatGPT pages to extract questions
2. **Question Extraction**: Analyzes the page DOM to find only user-typed questions
3. **Sidebar Creation**: Creates a fixed sidebar on the right side of the screen
4. **Real-time Updates**: Uses MutationObserver to automatically update when new messages are added
5. **Smooth Scrolling**: Uses `scrollIntoView` to smoothly scroll to questions when clicked

## Supported Browsers

- Google Chrome (recommended)
- Microsoft Edge (Chromium-based)
- Other Chromium-based browsers

## Privacy & Permissions

### Permissions Used

- **host_permissions** (required): Allows the extension to inject content scripts into ChatGPT pages (chat.openai.com, chatgpt.com)

### Privacy Policy

- This extension does not collect any data
- All processing happens locally in your browser
- No data is sent to external servers
- Works only on ChatGPT pages
- No user tracking or analytics

## Support

If you encounter any issues or have feature suggestions, please open an issue.

## License

MIT License

## Version History

### 1.0.0
- Initial release
- Question list display functionality
- Click to scroll functionality
- Collapsible sidebar with 2-character preview when collapsed
