document.addEventListener('DOMContentLoaded', function() {
  const checkBtn = document.getElementById('checkBtn');
  const message = document.getElementById('message');

  if (!checkBtn || !message) {
    return;
  }

  checkBtn.addEventListener('click', function() {
    message.textContent = '확인 중...';
    message.style.color = '#666';
    
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (chrome.runtime.lastError) {
        message.textContent = `❌ 에러: ${chrome.runtime.lastError.message}`;
        message.style.color = '#ef4444';
        return;
      }
      
      if (!tabs || !tabs[0]) {
        message.textContent = '❌ 활성 탭을 찾을 수 없습니다';
        message.style.color = '#ef4444';
        return;
      }
      
      const tab = tabs[0];
      const url = tab.url;
      
      if (!url) {
        message.textContent = '❌ 탭 URL을 가져올 수 없습니다';
        message.style.color = '#ef4444';
        return;
      }
      
      if (!url.includes('chat.openai.com') && !url.includes('chatgpt.com')) {
        message.textContent = '❌ ChatGPT 페이지가 아닙니다.\n\nChatGPT 페이지에서만 작동합니다.';
        message.style.color = '#ef4444';
        message.style.fontSize = '12px';
        message.style.whiteSpace = 'pre-line';
        return;
      }
      
      chrome.tabs.sendMessage(tab.id, { action: 'ping' }, function(response) {
        if (chrome.runtime.lastError) {
          message.textContent = '❌ Content script가 실행되지 않았습니다!\n\nChatGPT 페이지를 새로고침해주세요.';
          message.style.color = '#ef4444';
          message.style.fontSize = '11px';
          message.style.whiteSpace = 'pre-line';
        } else if (response && response.status === 'ok') {
          message.textContent = '✅ Content script가 실행 중입니다!';
          message.style.color = '#4CAF50';
        } else {
          message.textContent = '⚠️ 응답을 받지 못했습니다.';
          message.style.color = '#f59e0b';
        }
      });
    });
  });
});
