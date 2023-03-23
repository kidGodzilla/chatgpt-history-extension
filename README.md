# ChatGPT History Extension

A simple extension to keep a backup of your ChatGPT history

## Instructions

1. Unzip this extension somewhere (and don't remove it)

Then:

### Chrome:
4. Open [chrome://extensions/](chrome://extensions/)
5. Enable Developer Mode (toggle in upper right corner of screen)
6. Click "Load Unpacked" (top-left corner)
7. Select your extension directory

### Firefox: 
4. Navigate to [about:debugging#/runtime/this-firefox](about:debugging#/runtime/this-firefox) in your browser.
5. Click Load Temporary Addon & then select the manifest.json in the folder you just created

### That's it!

Remember, Updates don't occur automatically when you manually install the extension from source. `¯\_(ツ)_/¯`


## Using the extension
1. Navigate to [https://chat.openai.com/](ChatGPT), and browse normally.
2. The extension will store a backup of your conversations in your browser's local storage
3. If they fail to load from OpenAI's servers, they will be loaded from the extension.

Note: if you have a lot of history, you should page through it all once by clicking "Load More" until there is nothing else to load, so the extension saves everything.
