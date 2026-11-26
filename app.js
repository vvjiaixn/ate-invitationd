const card = document.querySelector('#card');
const progress = document.querySelector('#progress');

const CUSTOM_FOOD = '其他';
const CUSTOM_FOOD_MAX = 6;
const AVATAR_SRC = 'assets/dog-avatar.jpg';
const NICKNAME = '妮妮';

// 确认页与海报共用同一份文案，改一处两边同时生效
const FINAL_TITLE_LINES = [`${NICKNAME}，真开心你没拒绝～`, '我会准时来接你！'];
const FINAL_ROUTE_LINE = '带好胃口，我带好路线。';

function finalMealLine(food) {
  return `${formatDate(state.date)} ${state.time}，我们去吃${food}。`;
}

const foods = [
  { emoji: '🍕', name: '披萨' },
  { emoji: '🍣', name: '寿司' },
  { emoji: '🍲', name: '火锅' },
  { emoji: '🍖', name: '烤肉' },
  { emoji: '🍜', name: '拉面' },
  { emoji: '🌶️', name: '麻辣烫' },
  { emoji: '🦞', name: '小龙虾' },
  { emoji: '🍢', name: '烧烤' },
  { emoji: '🍽️', name: CUSTOM_FOOD },
];

const state = {
  step: 0,
  date: getTomorrow(),
  time: '17:00',
  food: '火锅',
  customFood: '',
  noCount: 0,
};

let foodAdvanceTimer = null;

const noLabels = ['不要 🤔', '再想想嘛 🥺', '点不到我 😌', '真的不要？😭'];

function getTomorrow() {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function setStep(step) {
  state.step = step;
  render();
}

function render() {
  card.className = 'invitation-card';

  if (state.step === 0) renderInvite();
  if (state.step === 1) renderSurprise();
  if (state.step === 2) renderSchedule();
  if (state.step === 3) renderFood();
  if (state.step === 4) renderFinal();

  renderProgress();
  card.classList.remove('is-entering');
  requestAnimationFrame(() => card.classList.add('is-entering'));
}

function renderInvite() {
  card.innerHTML = `
    <img class="avatar" src="${AVATAR_SRC}" alt="开心的法国斗牛犬" />
    <h1 class="title">🌸 可以和我一起<br />约会嘛？！ 🌸</h1>
    <p class="subtitle">${NICKNAME}，当面说我会卡壳，只好写成了一页。</p>
    <div class="actions">
      <button class="comic-button primary" id="yesButton" type="button">愿意 ❤</button>
      <button class="comic-button no-button" id="noButton" type="button">不要 🤔</button>
    </div>
  `;

  card.querySelector('#yesButton').addEventListener('click', () => setStep(1));
  const noButton = card.querySelector('#noButton');
  noButton.addEventListener('pointerenter', dodgeNoButton);
  noButton.addEventListener('click', dodgeNoButton);
}

function dodgeNoButton(event) {
  event.preventDefault();
  const button = event.currentTarget;
  state.noCount += 1;
  const direction = state.noCount % 2 === 0 ? -1 : 1;
  const horizontal = direction * Math.min(72, 20 + state.noCount * 12);
  const vertical = state.noCount % 3 === 0 ? -18 : 10;
  button.style.translate = `${horizontal}px ${vertical}px`;
  button.textContent = noLabels[state.noCount % noLabels.length];
}

function renderSurprise() {
  card.innerHTML = `
    <div class="square-icon red" aria-hidden="true">🥜</div>
    <h1 class="title compact">等下，你真的点了愿意？？ 😭</h1>
    <p class="subtitle">我都已经准备好被你点“不要”了。</p>
    <button class="comic-button primary wide single-action" id="continueButton" type="button">好啦好啦 →</button>
  `;

  card.querySelector('#continueButton').addEventListener('click', () => setStep(2));
}

function renderSchedule() {
  card.innerHTML = `
    <div class="square-icon" aria-hidden="true">📅</div>
    <h1 class="title compact">所以...你什么时候有空？ 😉</h1>
    <form class="form-stack" id="scheduleForm">
      <div class="field">
        <label for="dateInput">选一天 🌹</label>
        <input id="dateInput" name="date" type="date" min="${todayValue()}" value="${state.date}" required />
      </div>
      <div class="field">
        <label for="timeInput">几点呢？ 💗</label>
        <input id="timeInput" name="time" type="time" value="${state.time}" required />
      </div>
      <button class="comic-button primary wide" type="submit">确定时间 ❤</button>
    </form>
  `;

  card.querySelector('#scheduleForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    state.date = formData.get('date');
    state.time = formData.get('time');
    setStep(3);
  });
}

function todayValue() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function renderFood() {
  card.classList.add('food-card');
  const isCustom = state.food === CUSTOM_FOOD;
  card.innerHTML = `
    <h1 class="title compact">我们吃点什么？ 🍽️✨</h1>
    <p class="subtitle">挑一个今天的约会氛围，也可以自己写。</p>
    <div class="food-grid" role="group" aria-label="选择约会餐食">
      ${foods
        .map(
          (food) => `
            <button class="food-option${food.name === state.food ? ' selected' : ''}" data-food="${food.name}" type="button" aria-pressed="${food.name === state.food}">
              <span class="food-emoji" aria-hidden="true">${food.emoji}</span>
              <span class="food-name">${food.name}</span>
            </button>
          `,
        )
        .join('')}
    </div>
    <div class="custom-food${isCustom ? ' is-open' : ''}" id="customFood">
      <label class="custom-food-label" for="customFoodInput">想吃什么？自己写一个 ✍️</label>
      <div class="custom-food-row">
        <input
          class="custom-food-input"
          id="customFoodInput"
          type="text"
          maxlength="${CUSTOM_FOOD_MAX}"
          autocomplete="off"
          enterkeyhint="done"
          placeholder="例如：日料、私房菜"
          value="${escapeHtml(state.customFood)}"
        />
        <button class="comic-button primary custom-food-confirm" id="customFoodConfirm" type="button">就它 ❤</button>
      </div>
      <p class="custom-food-hint" id="customFoodHint" role="status" aria-live="polite"></p>
    </div>
  `;

  const panel = card.querySelector('#customFood');
  const input = card.querySelector('#customFoodInput');
  const hint = card.querySelector('#customFoodHint');

  const markSelected = (target) => {
    card.querySelectorAll('.food-option').forEach((option) => {
      const selected = option === target;
      option.classList.toggle('selected', selected);
      option.setAttribute('aria-pressed', String(selected));
    });
  };

  const submitCustom = () => {
    const value = input.value.trim().replace(/\s+/g, ' ');
    if (!value) {
      hint.textContent = '先写一个想吃的，再点「就它」～';
      input.focus();
      return;
    }
    state.customFood = value.slice(0, CUSTOM_FOOD_MAX);
    state.food = state.customFood;
    setStep(4);
  };

  card.querySelectorAll('.food-option').forEach((button) => {
    button.addEventListener('click', () => {
      window.clearTimeout(foodAdvanceTimer);
      markSelected(button);

      if (button.dataset.food === CUSTOM_FOOD) {
        state.food = CUSTOM_FOOD;
        panel.classList.add('is-open');
        hint.textContent = '';
        window.setTimeout(() => input.focus(), 60);
        return;
      }

      state.food = button.dataset.food;
      panel.classList.remove('is-open');
      foodAdvanceTimer = window.setTimeout(() => setStep(4), 360);
    });
  });

  card.querySelector('#customFoodConfirm').addEventListener('click', submitCustom);
  input.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    event.preventDefault();
    submitCustom();
  });
  input.addEventListener('input', () => {
    if (hint.textContent) hint.textContent = '';
  });

  if (isCustom) window.setTimeout(() => input.focus(), 60);
}

function renderFinal() {
  card.classList.add('final-card');
  const formattedDate = formatDate(state.date);
  const foodName = escapeHtml(state.food);
  card.innerHTML = `
    <img class="avatar" src="${AVATAR_SRC}" alt="开心的法国斗牛犬" />
    <h1 class="title compact">${FINAL_TITLE_LINES.join('<br />')}</h1>
    <p class="subtitle">${finalMealLine(foodName)}${FINAL_ROUTE_LINE}</p>
    <div class="summary-grid" aria-label="约会安排">
      <div class="summary-item">
        <span class="summary-label">DATE</span>
        <strong class="summary-value">${formattedDate}</strong>
      </div>
      <div class="summary-item">
        <span class="summary-label">TIME</span>
        <strong class="summary-value">${state.time}</strong>
      </div>
      <div class="summary-item">
        <span class="summary-label">MENU</span>
        <strong class="summary-value">${foodName}</strong>
      </div>
    </div>
    <div class="final-actions">
      <button class="comic-button save-card-button" id="saveCardButton" type="button">
        <span aria-hidden="true">⇩</span>
        <span>保存约会卡片</span>
      </button>
      <p class="save-status" id="saveStatus" role="status" aria-live="polite"></p>
      <button class="restart-button" id="restartButton" type="button">↻ 重新开始</button>
    </div>
  `;

  card.querySelector('#saveCardButton').addEventListener('click', saveInvitationCard);
  card.querySelector('#restartButton').addEventListener('click', restartInvitation);
  prepareSaveButton();
}

function restartInvitation() {
  window.clearTimeout(foodAdvanceTimer);
  foodAdvanceTimer = null;
  state.step = 0;
  state.date = getTomorrow();
  state.time = '17:00';
  state.food = '火锅';
  state.customFood = '';
  state.noCount = 0;
  render();
}

function prepareSaveButton() {
  const button = card.querySelector('#saveCardButton');
  const status = card.querySelector('#saveStatus');
  const avatar = card.querySelector('.avatar');
  const enableSaving = () => {
    button.disabled = false;
    status.textContent = '';
  };

  if (avatar.complete && avatar.naturalWidth > 0) {
    enableSaving();
    return;
  }

  button.disabled = true;
  status.textContent = '头像加载中…';
  avatar.addEventListener('load', enableSaving, { once: true });
  avatar.addEventListener(
    'error',
    () => {
      status.textContent = '头像加载失败，请刷新重试';
    },
    { once: true },
  );
}

function saveInvitationCard() {
  const button = card.querySelector('#saveCardButton');
  const status = card.querySelector('#saveStatus');
  const avatar = card.querySelector('.avatar');
  if (!avatar.complete || avatar.naturalWidth === 0) {
    status.textContent = '头像加载中，请稍后再试';
    return;
  }
  const originalContent = button.innerHTML;
  button.disabled = true;
  button.innerHTML = '<span aria-hidden="true">…</span><span>正在生成</span>';
  status.textContent = '';

  try {
    const canvas = buildInvitationCanvas();
    const blob = dataUrlToBlob(canvas.toDataURL('image/png'));
    const fileName = `约会卡片-${state.date}.png`;
    const file = new File([blob], fileName, { type: 'image/png' });
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const canShareFile =
      isMobile &&
      typeof navigator.share === 'function' &&
      typeof navigator.canShare === 'function' &&
      navigator.canShare({ files: [file] });

    if (canShareFile) {
      navigator
        .share({ files: [file], title: '约会卡片' })
        .then(() => {
          status.textContent = '约会卡片已准备好';
        })
        .catch((error) => {
          status.textContent = error.name === 'AbortError' ? '已取消保存' : '保存失败，请重试';
        });
    } else {
      downloadBlob(blob, fileName);
      status.textContent = '图片已保存';
    }
  } catch (error) {
    console.error('生成约会卡片失败', error);
    status.textContent = '保存失败，请重试';
  } finally {
    button.disabled = false;
    button.innerHTML = originalContent;
  }
}

function buildInvitationCanvas() {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1440;
  const context = canvas.getContext('2d');
  const ink = '#17171d';
  const paper = '#fffefd';
  const pink = '#e94eb6';
  const softPink = '#f9cce9';
  const muted = '#747078';
  const avatar = card.querySelector('.avatar');
  const formattedDate = formatDate(state.date);

  context.fillStyle = '#fff8fc';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = pink;
  context.fillRect(0, 0, canvas.width, 18);
  context.fillRect(0, canvas.height - 18, canvas.width, 18);

  drawPosterDecoration(context, '🌸', 104, 148, 48, -0.15);
  drawPosterDecoration(context, '🌺', 922, 208, 42, 0.14);
  drawPosterDecoration(context, '♥', 126, 1268, 34, -0.1, pink);
  drawPosterDecoration(context, '♥', 930, 1225, 30, 0.12, pink);

  context.fillStyle = ink;
  roundedRect(context, 78, 86, 924, 1272, 62);
  context.fill();

  context.fillStyle = paper;
  context.strokeStyle = ink;
  context.lineWidth = 8;
  roundedRect(context, 58, 60, 924, 1272, 62);
  context.fill();
  context.stroke();

  context.strokeStyle = 'rgba(23, 23, 29, 0.1)';
  context.lineWidth = 2;
  roundedRect(context, 82, 84, 876, 1224, 44);
  context.stroke();

  context.fillStyle = muted;
  context.font = '800 24px "PingFang SC", "Microsoft YaHei", sans-serif';
  context.textAlign = 'center';
  context.fillText('约 会 确 认', 540, 140);

  drawAvatar(context, avatar, 423, 174, 234, 52);

  context.fillStyle = ink;
  context.textAlign = 'center';
  FINAL_TITLE_LINES.forEach((line, index) => {
    const size = fitFontSize(context, line, 820, 62, 44);
    context.font = `900 ${size}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    context.fillText(line, 540, 495 + index * 85);
  });

  const mealLine = finalMealLine(state.food);
  context.fillStyle = muted;
  context.font = `700 ${fitFontSize(context, mealLine, 820, 29, 21)}px "PingFang SC", "Microsoft YaHei", sans-serif`;
  context.textAlign = 'center';
  context.fillText(mealLine, 540, 658);
  context.fillText(FINAL_ROUTE_LINE, 540, 705);

  context.fillStyle = ink;
  roundedRect(context, 142, 792, 816, 330, 38);
  context.fill();
  context.fillStyle = paper;
  context.strokeStyle = ink;
  context.lineWidth = 6;
  roundedRect(context, 126, 772, 816, 330, 38);
  context.fill();
  context.stroke();

  const details = [
    { label: '日期', value: formattedDate },
    { label: '时间', value: state.time },
    { label: '餐食', value: state.food },
  ];

  details.forEach((detail, index) => {
    const x = 155 + index * 255;
    context.fillStyle = index === 2 ? softPink : paper;
    context.strokeStyle = index === 2 ? '#ce2f96' : ink;
    context.lineWidth = 5;
    roundedRect(context, x, 826, 226, 214, 28);
    context.fill();
    context.stroke();

    context.fillStyle = pink;
    context.font = '900 23px "PingFang SC", "Microsoft YaHei", sans-serif';
    context.textAlign = 'left';
    context.fillText(detail.label, x + 26, 880);

    context.fillStyle = ink;
    const valueSize = fitFontSize(context, detail.value, 190, 38, 22, 900);
    context.font = `900 ${valueSize}px "PingFang SC", "Microsoft YaHei", sans-serif`;
    context.textAlign = 'center';
    context.fillText(detail.value, x + 113, 966);
  });

  context.fillStyle = pink;
  context.font = '900 34px "PingFang SC", "Microsoft YaHei", sans-serif';
  context.textAlign = 'center';
  context.fillText('♥  期待这场约会  ♥', 540, 1215);

  context.fillStyle = muted;
  context.font = '700 23px "PingFang SC", "Microsoft YaHei", sans-serif';
  context.fillText('这次不只是说说而已', 540, 1268);

  return canvas;
}

function fitFontSize(context, text, maxWidth, startSize, minSize, weight = 900) {
  const family = '"PingFang SC", "Microsoft YaHei", sans-serif';
  let size = startSize;
  while (size > minSize) {
    context.font = `${weight} ${size}px ${family}`;
    if (context.measureText(text).width <= maxWidth) return size;
    size -= 2;
  }
  context.font = `${weight} ${minSize}px ${family}`;
  return minSize;
}

function escapeHtml(value) {
  const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  return String(value).replace(/[&<>"']/g, (character) => map[character]);
}

function drawAvatar(context, image, x, y, size, radius) {
  const sourceWidth = image.naturalWidth || image.width;
  const sourceHeight = image.naturalHeight || image.height;
  const scale = Math.max(size / sourceWidth, size / sourceHeight);
  const drawWidth = sourceWidth * scale;
  const drawHeight = sourceHeight * scale;

  context.save();
  roundedRect(context, x, y, size, size, radius);
  context.clip();
  context.drawImage(
    image,
    x + (size - drawWidth) / 2,
    y + (size - drawHeight) / 2,
    drawWidth,
    drawHeight,
  );
  context.restore();
}

function drawPosterDecoration(context, symbol, x, y, size, rotation, color) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.fillStyle = color || '#17171d';
  context.font = `${size}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
  context.textAlign = 'center';
  context.fillText(symbol, 0, 0);
  context.restore();
}

function roundedRect(context, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + safeRadius, y);
  context.arcTo(x + width, y, x + width, y + height, safeRadius);
  context.arcTo(x + width, y + height, x, y + height, safeRadius);
  context.arcTo(x, y + height, x, y, safeRadius);
  context.arcTo(x, y, x + width, y, safeRadius);
  context.closePath();
}

function dataUrlToBlob(dataUrl) {
  const [metadata, encodedData] = dataUrl.split(',');
  const mimeType = metadata.match(/data:(.*?);base64/)[1];
  const binary = atob(encodedData);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return new Blob([bytes], { type: mimeType });
}

function downloadBlob(blob, fileName) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function formatDate(dateValue) {
  const [, month, day] = dateValue.split('-').map(Number);
  return `${month}月${day}日`;
}

function renderProgress() {
  progress.innerHTML = Array.from({ length: 5 }, (_, index) => {
    const className = index <= state.step ? 'done' : '';
    return `<span class="${className}" aria-hidden="true">♥</span>`;
  }).join('');
  progress.setAttribute('aria-label', `约会邀请进度：第 ${state.step + 1} 步，共 5 步`);
}

render();
