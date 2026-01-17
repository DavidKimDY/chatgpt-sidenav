// ChatGPT 질문 사이드바 익스텐션

(function() {
  'use strict';

  // 사이드바 생성
  function createSidebar() {
    try {
      const sidebar = document.createElement('div');
      sidebar.id = 'chatgpt-question-sidebar';
      sidebar.innerHTML = `
        <div class="sidebar-header">
          <button id="sidebar-toggle" class="sidebar-toggle">>></button>
        </div>
        <div class="sidebar-content">
          <div id="question-list"></div>
        </div>
      `;
      
      if (!document.body) {
        return null;
      }
      
      document.body.appendChild(sidebar);
      
      // 토글 버튼 이벤트
      const toggleBtn = sidebar.querySelector('#sidebar-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          sidebar.classList.toggle('collapsed');
          toggleBtn.textContent = sidebar.classList.contains('collapsed') ? '<<' : '>>';
          // 사이드바 상태 변경 시 업데이트
          updateSidebar();
        });
      }
      
      return sidebar;
    } catch (error) {
      return null;
    }
  }

  // 질문 추출 함수 (사용자 메시지만)
  function extractQuestions() {
    const questionElements = [];
    const seenTexts = new Set();
    
    // 방법 1: article[data-turn="user"]로 직접 찾기 (가장 확실한 방법)
    const userArticles = document.querySelectorAll('article[data-turn="user"]');
    
    userArticles.forEach(article => {
      // article 내부에서 사용자 메시지 텍스트 찾기
      const userMessageDiv = article.querySelector('[data-message-author-role="user"]');
      
      if (userMessageDiv) {
        // 실제 텍스트 추출 (.whitespace-pre-wrap 또는 직접 텍스트)
        const textElement = userMessageDiv.querySelector('.whitespace-pre-wrap') || userMessageDiv;
        const textContent = textElement.textContent.trim();
        
        if (textContent && textContent.length > 0 && !seenTexts.has(textContent)) {
          seenTexts.add(textContent);
          questionElements.push(article);
        }
      }
    });

    // 방법 2: data-message-author-role="user"로 찾기 (방법 1에서 못 찾은 경우)
    if (questionElements.length === 0) {
      const userMessages = document.querySelectorAll('[data-message-author-role="user"]');
      
      userMessages.forEach(userMsg => {
        // 부모 article 찾기
        const article = userMsg.closest('article');
        
        if (article) {
          // assistant가 아닌지 확인
          if (article.getAttribute('data-turn') !== 'assistant') {
            const textElement = userMsg.querySelector('.whitespace-pre-wrap') || userMsg;
            const textContent = textElement.textContent.trim();
            
            if (textContent && textContent.length > 0 && !seenTexts.has(textContent)) {
              seenTexts.add(textContent);
              questionElements.push(article);
            }
          }
        }
      });
    }

    return questionElements;
  }

  // 질문 텍스트 추출 (사용자 메시지만)
  function getQuestionText(element, isCollapsed = false) {
    // article에서 사용자 메시지 찾기
    const userMessage = element.querySelector('[data-message-author-role="user"]');
    
    if (userMessage) {
      // .whitespace-pre-wrap 클래스를 가진 요소에서 텍스트 추출 (실제 질문 텍스트)
      const textElement = userMessage.querySelector('.whitespace-pre-wrap');
      
      if (textElement) {
        const textContent = textElement.textContent.trim();
        // 접힌 상태면 2글자만, 펼친 상태면 50글자까지
        if (isCollapsed) {
          return textContent.length > 2 ? textContent.substring(0, 2) : textContent;
        }
        return textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
      }
      
      // .whitespace-pre-wrap이 없으면 직접 텍스트 추출 (버튼 등 제외)
      const walker = document.createTreeWalker(
        userMessage,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: function(node) {
            // 버튼이나 아이콘 내부의 텍스트는 제외
            const parent = node.parentElement;
            if (parent && (parent.tagName === 'BUTTON' || parent.closest('button'))) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          }
        },
        false
      );
      
      const textNodes = [];
      let node;
      while (node = walker.nextNode()) {
        const text = node.textContent.trim();
        if (text) {
          textNodes.push(text);
        }
      }
      
      const textContent = textNodes.join(' ').trim();
      
      if (textContent) {
        if (isCollapsed) {
          return textContent.length > 2 ? textContent.substring(0, 2) : textContent;
        }
        return textContent.length > 50 ? textContent.substring(0, 50) + '...' : textContent;
      }
    }
    
    return '';
  }

  // 언어 감지 함수
  function getLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    return lang.startsWith('ko') ? 'ko' : 'en';
  }

  // 사이드바 업데이트
  function updateSidebar() {
    const questionList = document.getElementById('question-list');
    if (!questionList) {
      return;
    }

    const sidebar = document.getElementById('chatgpt-question-sidebar');
    const isCollapsed = sidebar && sidebar.classList.contains('collapsed');

    const questions = extractQuestions();
    
    if (questions.length === 0) {
      const lang = getLanguage();
      const noQuestionsText = lang === 'ko' ? '아직 질문이 없습니다.' : 'No questions yet.';
      questionList.innerHTML = `<div class="no-questions">${noQuestionsText}</div>`;
      return;
    }

    questionList.innerHTML = questions.map((questionEl, index) => {
      const text = getQuestionText(questionEl, isCollapsed);
      return `
        <div class="question-item" data-index="${index}">
          <div class="question-text">${text}</div>
        </div>
      `;
    }).join('');

    questionList.querySelectorAll('.question-item').forEach((item, index) => {
      item.addEventListener('click', () => {
        scrollToQuestion(questions[index]);
      });
    });
  }

  // 질문으로 스크롤 (부드러운 애니메이션)
  function scrollToQuestion(questionElement) {
    if (!questionElement) {
      return;
    }

    questionElement.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });

    questionElement.style.transition = 'background-color 0.3s';
    questionElement.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
    
    setTimeout(() => {
      questionElement.style.backgroundColor = '';
    }, 2000);
  }


  // 초기화
  function init() {
    const existingSidebar = document.getElementById('chatgpt-question-sidebar');
    if (existingSidebar) {
      existingSidebar.remove();
    }

    const sidebar = createSidebar();
    
    if (!sidebar) {
      return;
    }
    
    setTimeout(() => {
      updateSidebar();
    }, 1000);

    const observer = new MutationObserver(() => {
      updateSidebar();
    });

    const targetNode = document.querySelector('main') || 
                      document.querySelector('[role="main"]') ||
                      document.body;
    
    if (targetNode) {
      observer.observe(targetNode, {
        childList: true,
        subtree: true
      });
    }

    setInterval(updateSidebar, 3000);
  }

  // 페이지 로드 완료 후 실행
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // SPA 라우팅 대비 (URL 변경 감지)
  let lastUrl = location.href;
  new MutationObserver(() => {
    const url = location.href;
    if (url !== lastUrl) {
      lastUrl = url;
      setTimeout(init, 1000);
    }
  }).observe(document, { subtree: true, childList: true });

  // 팝업에서 상태 확인을 위한 메시지 리스너
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'ping') {
      sendResponse({ status: 'ok', message: 'Content script 실행 중' });
      return true;
    }
  });

})();
