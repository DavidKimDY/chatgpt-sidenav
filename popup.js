document.addEventListener('DOMContentLoaded', function() {
  const button = document.getElementById('clickBtn');
  const message = document.getElementById('message');

  button.addEventListener('click', function() {
    message.textContent = '버튼이 클릭되었습니다!';
    message.style.color = '#4CAF50';
  });
});
