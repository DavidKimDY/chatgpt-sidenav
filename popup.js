document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('checkBtn');
  const message = document.getElementById('message');

  if (!checkBtn || !message) {
    return;
  }

  checkBtn.addEventListener('click', function() {
    message.textContent = 'Checking...';
    message.style.color = '#666';
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        message.textContent = `❌ Error: ${chrome.runtime.lastError.message}`;
        message.style.color = '#ef4444';
        return;
      }
      
      if (!tabs || !tabs[0]) {
        message.textContent = '❌ Active tab not found';
        message.style.color = '#ef4444';
        return;
      }
      
      const tab = tabs[0];
      const url = tab.url;
      
      if (!url) {
        message.textContent = '❌ Unable to get tab URL';
        message.style.color = '#ef4444';
        return;
      }
      
      if (!url.includes('chat.openai.com') && !url.includes('chatgpt.com')) {
        message.textContent = '❌ Not a ChatGPT page.\n\nThis extension only works on ChatGPT pages.';
        message.style.color = '#ef4444';
        message.style.fontSize = '12px';
        message.style.whiteSpace = 'pre-line';
        return;
      }
      
      chrome.tabs.sendMessage(tab.id, { action: 'ping' }, function(response) {
        if (chrome.runtime.lastError) {
          message.textContent = '❌ Content script is not running!\n\nPlease refresh the ChatGPT page.';
          message.style.color = '#ef4444';
          message.style.fontSize = '11px';
          message.style.whiteSpace = 'pre-line';
        } else if (response && response.status === 'ok') {
          message.textContent = '✅ Content script is running!';
          message.style.color = '#4CAF50';
        } else {
          message.textContent = '⚠️ No response received.';
          message.style.color = '#f59e0b';
        }
      });
    });
  });
});
