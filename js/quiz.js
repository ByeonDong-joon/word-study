(function(){
  const data = [
    { word: "again", meaning: "다시, 또" },
    { word: "angry", meaning: "화난" },
    { word: "happy", meaning: "행복한" },
    { word: "sad", meaning: "슬픈" },
    { word: "sleepy", meaning: "졸린" },
    { word: "some", meaning: "조금" },
    { word: "thirsty", meaning: "목이 마른" },
    { word: "tired", meaning: "피곤한" },
    { word: "try", meaning: "시도하다" },
    { word: "water", meaning: "물" }
  ];
  let qIndex = 0;
  const total = 30;
  let correctCount = 0;
  let currentCount = 0;
  let firstTry = true;
  let startTime = null;
  let timerInterval = null;

  const qnumEl = document.getElementById('qnum');
  const promptEl = document.getElementById('prompt');
  const choicesEl = document.getElementById('choices');
  const inputAreaEl = document.getElementById('input-area');
  const hintEl = document.getElementById('scramble-hint');
  const inputEl = document.getElementById('answer-input');
  const submitBtn = document.getElementById('submit-btn');
  const feedbackEl = document.getElementById('feedback');
  const statsEl = document.getElementById('stats');
  const timerEl = document.getElementById('timer');

  function getLevel(idx) {
    if (idx < 10) return 1;
    if (idx < 20) return 2;
    return 3;
  }

  function shuffleLetters(word) {
    return word.split('').sort(() => 0.5 - Math.random()).join(' ');
  }

  function formatTime(ms) {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const mm = m < 10 ? '0' + m : m;
    const ss = s < 10 ? '0' + s : s;
    return mm + ':' + ss;
  }

  function updateTimer() {
    const elapsed = Date.now() - startTime;
    timerEl.innerText = formatTime(elapsed);
  }

  function renderQuestion() {
    if (qIndex === 0) {
      startTime = Date.now();
      timerInterval = setInterval(updateTimer, 1000);
    }
    firstTry = true;
    qnumEl.innerText = qIndex + 1;
    const item = data[qIndex % data.length];
    const level = getLevel(qIndex);
    promptEl.innerText = item.meaning;
    statsEl.innerText = `${correctCount}/${currentCount}`;
    updateTimer();
    feedbackEl.innerText = '';

    if (level === 1) {
      inputAreaEl.classList.add('hidden');
      choicesEl.classList.remove('hidden');
      const others = data.map(x => x.word).filter(w => w !== item.word)
        .sort(() => 0.5 - Math.random()).slice(0, 3);
      const opts = [item.word, ...others].sort(() => 0.5 - Math.random());
      choicesEl.querySelectorAll('.choice-btn').forEach((btn, i) => {
        btn.innerText = opts[i];
      });
    } else {
      choicesEl.classList.add('hidden');
      inputAreaEl.classList.remove('hidden');
      if (level === 2) {
        hintEl.classList.remove('hidden');
        hintEl.innerText = shuffleLetters(item.word);
      } else {
        hintEl.classList.add('hidden');
      }
      inputEl.value = '';
      inputEl.focus();
    }
  }

  function finishQuiz() {
    clearInterval(timerInterval);
    const elapsed = Date.now() - startTime;
    const timeStr = formatTime(elapsed);
    feedbackEl.innerText = `총 ${total}문제 중 ${correctCount}문제 맞혔습니다. 걸린 시간은 ${timeStr}입니다`;
    statsEl.innerText = `${correctCount}/${currentCount}`;
  }

  function checkAnswer(rawAnswer) {
    const answer = rawAnswer.trim().toLowerCase();
    const correct = data[qIndex % data.length].word.toLowerCase();
    if (answer === correct) {
      if (firstTry) correctCount++;
      currentCount++;
      feedbackEl.innerText = '정답!';
      qIndex++;
      if (qIndex < total) {
        setTimeout(renderQuestion, 800);
      } else {
        finishQuiz();
      }
    } else {
      feedbackEl.innerText = '다시 시도!';
      firstTry = false;
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderQuestion();
    choicesEl.addEventListener('click', e => {
      if (e.target.matches('.choice-btn')) {
        checkAnswer(e.target.innerText);
      }
    });
    submitBtn.addEventListener('click', () => {
      checkAnswer(inputEl.value);
    });
    inputEl.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        e.preventDefault();
        checkAnswer(inputEl.value);
      }
    });
  });
})();

