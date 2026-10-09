const modal = document.getElementById('supportModal');
const openBtn = document.getElementById('openSupportBtn');
const closeBtn = document.querySelector('.close-chat');
const chatBox = document.getElementById('chatBox');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const banBtn = document.querySelector('.ban-btn');
const unbanBtn = document.querySelector('.unban-btn');
const statusText = document.getElementById('statusText');
const lockOverlay = document.createElement('div');
lockOverlay.className = 'site-locked';
lockOverlay.innerHTML = '<div class="lock-banner">Доступ ограничен</div>';
document.body.appendChild(lockOverlay);

let isBanned = false;

function openSupport() {
  modal.classList.remove('hidden');
}

function closeSupport() {
  modal.classList.add('hidden');
}

function addMessage(text, isUser = false) {
  const row = document.createElement('div');
  row.className = `message-row ${isUser ? 'from-user' : 'from-support'}`;

  if (!isUser) {
    const label = document.createElement('div');
    label.className = 'support-label';
    label.innerHTML = `Поддержка Steam <span>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
    row.appendChild(label);
  }

  const msg = document.createElement('div');
  msg.className = `message ${isUser ? 'bubble-user' : 'bubble-support'}`;
  msg.textContent = text;
  row.appendChild(msg);
  chatBox.appendChild(row);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function toggleBanState(nextState) {
  isBanned = nextState;

  if (isBanned) {
    banBtn.classList.add('active');
    unbanBtn.classList.remove('active');
    statusText.textContent = 'Заблокирован';
    statusText.style.color = '#ffb4b4';
    document.querySelector('.status-dot').style.background = '#f05a5a';
    sendBtn.disabled = true;
    lockOverlay.classList.add('visible');
  } else {
    banBtn.classList.remove('active');
    unbanBtn.classList.add('active');
    statusText.textContent = 'Онлайн';
    statusText.style.color = '#dfeaf8';
    document.querySelector('.status-dot').style.background = '#46d07d';
    sendBtn.disabled = false;
    lockOverlay.classList.remove('visible');
  }
}

openBtn.addEventListener('click', openSupport);
closeBtn.addEventListener('click', closeSupport);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeSupport();
  }
});

sendBtn.addEventListener('click', () => {
  const value = chatInput.value.trim();
  if (!value) return;
  if (isBanned) {
    addMessage('Ваш доступ ограничен. Попробуйте позже.', true);
    chatInput.value = '';
    return;
  }

  addMessage(value, true);
  chatInput.value = '';

  setTimeout(() => {
    const autoReplies = [
      'Спасибо, мы получили ваше сообщение. Проверяем причину ограничения.',
      'Ваш аккаунт был проверен. Для уточнения данных потребуется дополнительная информация.',
      'Мы уже рассматриваем запрос. Ожидайте ответ в этом окне.',
      'Пожалуйста, укажите, когда именно вы впервые увидели это уведомление.'
    ];
    const reply = autoReplies[Math.floor(Math.random() * autoReplies.length)];
    addMessage(reply, false);
  }, 700);
});

chatInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendBtn.click();
  }
});

banBtn.addEventListener('click', () => {
  toggleBanState(true);
  addMessage('Оператор включил блокировку доступа.', false);
});

unbanBtn.addEventListener('click', () => {
  toggleBanState(false);
  addMessage('Оператор снял блокировку. Доступ восстановлен.', false);
});

setTimeout(() => {
  openSupport();
}, 500);
