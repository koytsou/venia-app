// ===== ΡΥΘΜΙΣΕΙΣ =====
const HER_NAME = "αγάπη μου";
const PHOTO_PATH = "assets/slide1.jpg"; // ίδια φωτο για heart reveal
const PUZZLE_PHOTO = "assets/puzzle.jpg";
const VOICE_PATH = "assets/voice.mp3";
const SPOTIFY_LINK = "https://open.spotify.com/track/XXXXXXXXXXXX";

const FUTURE_CARDS = [
  { title: "📍 Ταξίδι", text: "Θέλω ένα ταξίδι μόνο για εμάς… να χαθούμε και να γελάμε όλη μέρα." },
  { title: "🏠 Σπίτι", text: "Ένα σπίτι με ζεστό φως, μουσική, και μια γωνιά που θα είναι “η γωνιά μας”." },
  { title: "💕 5 χρόνια", text: "Να είμαστε ακόμα ‘εμείς’. Με περισσότερες αναμνήσεις και την ίδια αγάπη." }
];

// ===== DOM =====
const intro = document.getElementById("intro");
const btnUs = document.getElementById("btnUs");

const steps = [...document.querySelectorAll(".step")];
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const songBox = document.getElementById("songBox");
const audioBox = document.getElementById("audioBox");

const btnNext2 = document.getElementById("btnNext2"); // από puzzle
const btnNext4 = document.getElementById("btnNext4"); // από song
const btnNext5 = document.getElementById("btnNext5"); // από voice

const futurePanel = document.getElementById("futurePanel");
const btnFutureNext = document.getElementById("btnFutureNext");

const btnYes = document.getElementById("btnYes");

const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

// Heart step
const heartWrap = document.getElementById("heartWrap");
const heartIcon = document.getElementById("heartIcon");
const heartText = document.getElementById("heartText");
const revealImg = document.getElementById("revealImg");
const holdHint = document.getElementById("holdHint");

// Boom UI
const ringFill = document.getElementById("ringFill");
const sparks = document.getElementById("sparks");

// Puzzle DOM
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzleText = document.getElementById("puzzleText");
const puzzleBadge = document.getElementById("puzzleBadge");
const btnPuzzleReset = document.getElementById("btnPuzzleReset");
const puzzleMini = document.getElementById("puzzleMini");

// HoldWords (step3)
const holdWordsWrap = document.getElementById("holdWordsWrap");
const holdWordsBig = document.getElementById("holdWordsBig");
const holdWordsHint = document.getElementById("holdWordsHint");
const holdWordsBarFill = document.getElementById("holdWordsBarFill");
const btnNextHoldWords = document.getElementById("btnNextHoldWords");

// Quiz DOM
const quizBox = document.getElementById("quizBox");
const btnQuizPrev = document.getElementById("btnQuizPrev");
const btnQuizNext = document.getElementById("btnQuizNext");
const quizMini = document.getElementById("quizMini");
const quizMiniEnd = document.getElementById("quizMiniEnd"); // νέο mini μήνυμα στο τέλος
const quizContinueWrap = document.getElementById("quizContinueWrap");
const btnQuizContinue = document.getElementById("btnQuizContinue");

// ===== QUIZ (οι δικές σου ερωτήσεις) =====
const QUIZ = [
  {
    q: "Ποιο ήταν το πρώτο μνμ μου;",
    options: [
      "Είσαι πολύ όμορφη",
      "Ήσουν χθες Αλχεμι;",
      "Ο κώλος σου είναι iconic"
    ],
    correct: 1,
    winText: "🥹 ΝΑΙ. Το θυμάσαι τέλεια.",
    loseText: "😌 Όχι μωρό… ήταν το «Ήσουν χθες Αλχεμι;»."
  },
  {
    q: "Πού πήγαμε πρώτη φορά μόνες μας;",
    options: ["Ναύπλιο", "Αθήνα", "Χαλκίδα"],
    correct: 0,
    winText: "💘 Σωστό. Ναύπλιο και αναμνήσεις.",
    loseText: "🙈 Όχι… Ναύπλιο ήταν."
  },
  {
    q: "Πότε είπαμε το πρώτο «σ’ αγαπώ»;",
    options: ["Δεν το είπαμε", "Την πρώτη μέρα", "Στη βίλα"],
    correct: 2,
    winText: "❤️ Στη βίλα. Πάντα εκεί θα μένει.",
    loseText: "🥺 Όχι… στη βίλα."
  }
];

// ===== STATE =====
let current = 0; // index στα steps (0..6)
let futureIndex = 0;

// Puzzle state
let puzzleLockedCount = 0;
let puzzleDone = false;

// Quiz state
let quizIndex = 0;
let quizAnswers = Array(QUIZ.length).fill(null);

// ===== QUIZ RENDER =====
function renderQuiz() {
  if (!quizBox) return;

  const item = QUIZ[quizIndex];
  const chosen = quizAnswers[quizIndex]; // null ή index επιλογής

  quizBox.innerHTML = `
    <div class="quizQ" style="font-weight:900; font-size:18px; margin-bottom:12px;">
      ${item.q}
    </div>

    <div class="quizOpts">
      ${item.options
        .map(
          (opt, i) => `
          <button class="quizOpt ${chosen === i ? "selected" : ""}" data-i="${i}" type="button">
            ${opt}
          </button>
        `
        )
        .join("")}
    </div>

    <div class="quizFeedback" id="quizFeedback" style="margin-top:12px; opacity:.9;">
      ${
        chosen !== null
          ? chosen === item.correct
            ? item.winText
            : item.loseText
          : ""
      }
    </div>
  `;

  // click options
  [...quizBox.querySelectorAll(".quizOpt")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      quizAnswers[quizIndex] = i;
      renderQuiz(); // re-render για selected + feedback
    });
  });

  // prev enable state
  if (btnQuizPrev) btnQuizPrev.disabled = quizIndex === 0;
}

// ===== QUIZ BUTTONS =====
if (btnQuizPrev) {
  btnQuizPrev.addEventListener("click", () => {
    if (quizIndex > 0) {
      quizIndex--;
      renderQuiz();
    }
  });
}

if (btnQuizNext) {
  btnQuizNext.addEventListener("click", () => {
    // πρέπει να απαντήσει
    if (quizAnswers[quizIndex] == null) return;

    // πάμε στην επόμενη
    if (quizIndex < QUIZ.length - 1) {
      quizIndex++;
      renderQuiz();
      return;
    }

    // ===== finished quiz =====
    if (quizMini) quizMini.classList.remove("hidden");
    if (quizMiniEnd) quizMiniEnd.classList.remove("hidden"); // ΝΕΟ mini μήνυμα
    if (quizContinueWrap) quizContinueWrap.classList.remove("hidden");

    if (btnQuizNext) btnQuizNext.disabled = true;
    if (btnQuizPrev) btnQuizPrev.disabled = true;
  });
}

if (btnQuizContinue) {
  btnQuizContinue.addEventListener("click", () => {
    goTo("stepFuture"); // πάμε στο μέλλον
  });
}

// ===== HELPERS =====
function vibrate(ms = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}

function openModal(text) {
  if (!modal || !modalText) return;
  modalText.textContent = text;
  modal.classList.remove("hidden");
}
function closeModalFn() {
  if (!modal) return;
  modal.classList.add("hidden");
}

function setProgress() {
  // Έχεις 7 screens: heart, puzzle, holdwords, song, voice, future, final
  const total = 7;

  // current είναι 0..6 => value 1..7
  const value = Math.min(Math.max(current + 1, 1), total);
  const pct = (value / total) * 100;

  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${value} / ${total}`;
}

function showStep(i) {
  steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
  current = i;
  setProgress();
  afterStepChange();
}

function goTo(stepId) {
  const idx = steps.findIndex((s) => s.id === stepId);
  if (idx >= 0) showStep(idx);
}

// ===== STEP CHANGE HOOKS =====
function afterStepChange() {
  const active = steps[current];
  if (!active) return;

  // init puzzle όταν μπαίνουμε στο step2
  if (active.id === "step2") {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => initPuzzle());
    });
  }

  // init quiz όταν μπαίνουμε στο stepQuiz
  if (active.id === "stepQuiz") {
    quizIndex = 0;
    quizAnswers = Array(QUIZ.length).fill(null);

    if (quizMini) quizMini.classList.add("hidden");
    if (quizMiniEnd) quizMiniEnd.classList.add("hidden");
    if (quizContinueWrap) quizContinueWrap.classList.add("hidden");

    if (btnQuizNext) btnQuizNext.disabled = false;
    if (btnQuizPrev) btnQuizPrev.disabled = false;

    renderQuiz();
  }
}

// ===== INTRO =====
function closeIntro() {
  if (!intro) return;
  intro.classList.add("hide");
  setTimeout(() => (intro.style.display = "none"), 360);
}
if (btnUs) btnUs.addEventListener("click", closeIntro);
if (intro)
  intro.addEventListener("click", (e) => {
    if (e.target === intro) closeIntro();
  });

// ===== CONTENT SETUP =====
if (songBox) {
  songBox.innerHTML = `
    <div style="opacity:.9;">Αυτό το τραγούδι μου θυμίζει εμάς.</div>
    <a class="btn primary" style="margin-top:10px; text-align:center;"
       href="${SPOTIFY_LINK}" target="_blank" rel="noopener">
      Άνοιξε στο Spotify ▶
    </a>
  `;
}

if (audioBox) {
  audioBox.innerHTML = `
    <div style="opacity:.9;">Πάτα play…</div>
    <audio controls style="width:100%; margin-top:10px;">
      <source src="${VOICE_PATH}" type="audio/mpeg" />
      Ο browser δεν υποστηρίζει audio.
    </audio>
  `;
}

// ===== NAV EVENTS (με ids, όχι indexes) =====
if (btnNext2) btnNext2.addEventListener("click", () => goTo("step3")); // puzzle -> holdWords
if (btnNextHoldWords) btnNextHoldWords.addEventListener("click", () => goTo("step4")); // holdWords -> song
if (btnNext4) btnNext4.addEventListener("click", () => goTo("step5")); // song -> voice
if (btnNext5) {
  btnNext5.addEventListener("click", () => {
    goTo("stepQuiz");
  });
}

// ===== FUTURE =====
if (btnFutureNext) {
  btnFutureNext.addEventListener("click", () => {
    const card = FUTURE_CARDS[futureIndex % FUTURE_CARDS.length];
    if (futurePanel) {
      futurePanel.innerHTML = `
        <div style="font-weight:950; margin-bottom:6px;">${card.title}</div>
        <div style="opacity:.9; line-height:1.45;">${card.text}</div>
      `;
    }
    futureIndex++;

    if (futureIndex >= FUTURE_CARDS.length) {
      btnFutureNext.textContent = "Συνέχεια";
      btnFutureNext.onclick = () => goTo("step7"); // final
    }
  });
}

if (btnYes) {
  btnYes.addEventListener("click", () => {
    openModal(`Το κρατάω αυτό 💘\nΧρόνια πολλά, ${HER_NAME}. Σε διαλέγω. Σήμερα και πάντα.`);
  });
}
if (modalClose) modalClose.addEventListener("click", closeModalFn);
if (modal)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModalFn();
  });

// ===== BOOM: sparks =====
function spawnSpark(type = "mix") {
  if (!sparks) return;
  const el = document.createElement("div");
  el.className = "spark";

  const roll = Math.random();
  if (type === "burst") el.textContent = roll < 0.6 ? "💗" : "💘";
  else el.textContent = roll < 0.5 ? "💗" : "✨";

  const angle = Math.random() * Math.PI * 2;
  const dist = 36 + Math.random() * 34;
  const dx = Math.cos(angle) * dist;
  const dy = Math.sin(angle) * dist;

  el.style.setProperty("--dx", `${dx.toFixed(1)}px`);
  el.style.setProperty("--dy", `${dy.toFixed(1)}px`);

  sparks.appendChild(el);
  el.addEventListener("animationend", () => el.remove());
}

// ===== HEART HOLD-TO-REVEAL + RING =====
let holding = false;
let raf = null;
let progress = 0; // 0..1
let lastT = 0;
const HOLD_DURATION = 1200;

function applyReveal(p) {
  const x = Math.max(0, Math.min(1, p));

  // photo reveal
  if (revealImg) {
    revealImg.style.opacity = String(x);
    const blur = 14 * (1 - x);
    const bright = 0.75 + 0.25 * x;
    revealImg.style.filter = `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(2)})`;
    const scale = 1.03 - 0.03 * x;
    revealImg.style.transform = `scale(${scale.toFixed(3)})`;
  }

  // ring progress
  if (ringFill) {
    const CIRC = 289; // must match CSS ring
    ringFill.style.strokeDashoffset = String(CIRC * (1 - x));
  }
}

function tick(t) {
  if (!holding) return;

  if (!lastT) lastT = t;
  const dt = t - lastT;
  lastT = t;

  progress += dt / HOLD_DURATION;
  if (progress > 1) progress = 1;

  applyReveal(progress);

  if (Math.random() < 0.28) spawnSpark("mix");

  if (progress >= 1) {
    holding = false;
    lastT = 0;

    if (holdHint) holdHint.textContent = "✔ Έτοιμο. Πάτα για συνέχεια.";

    if (heartWrap) {
      heartWrap.classList.add("boom");
      setTimeout(() => heartWrap.classList.remove("boom"), 650);
      heartWrap.classList.remove("is-holding");
    }

    for (let i = 0; i < 12; i++) setTimeout(() => spawnSpark("burst"), i * 22);
    vibrate(25);
    return;
  }

  raf = requestAnimationFrame(tick);
}

function startHold() {
  if (progress >= 1) return;
  holding = true;
  lastT = 0;

  if (heartWrap) heartWrap.classList.add("is-holding");
  if (heartText) heartText.innerHTML = "Αυτή είναι μία από αυτές.";
  if (holdHint) holdHint.textContent = "";

  vibrate(10);
  raf = requestAnimationFrame(tick);
}

function endHold() {
  if (!holding) return;
  holding = false;
  lastT = 0;
  if (raf) cancelAnimationFrame(raf);

  if (heartWrap) heartWrap.classList.remove("is-holding");

  if (progress < 1) {
    if (heartText) heartText.innerHTML = "Κράτα την καρδιά πατημένη…";
  }
}

function tapAfterComplete() {
  if (progress >= 1) goTo("step2"); // heart -> puzzle
}

function bindHold(el) {
  if (!el) return;
  el.addEventListener("pointerdown", startHold);
  el.addEventListener("pointerup", endHold);
  el.addEventListener("pointercancel", endHold);
  el.addEventListener("pointerleave", endHold);
  el.addEventListener("click", tapAfterComplete);
}

bindHold(heartWrap);
bindHold(heartIcon);

// ===== MINI PUZZLE 2x3 (STEP 2) =====
function initPuzzle() {
  if (!puzzleBoard) return;

  puzzleBoard.innerHTML = "";
  puzzleLockedCount = 0;
  puzzleDone = false;

  if (puzzleText) puzzleText.textContent = "Φτιάξε την φωτογραφία για να συνεχίσουμε… 💘";
  if (puzzleBadge) puzzleBadge.textContent = "0/6";
  if (btnNext2) btnNext2.classList.add("hidden");
  if (puzzleMini) puzzleMini.classList.add("hidden");
  if (puzzleBoard) puzzleBoard.classList.remove("done");

  const cols = 2;
  const rows = 3;

  const rect = puzzleBoard.getBoundingClientRect();
  const slotW = rect.width / cols;
  const slotH = rect.height / rows;

  const slots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;

      const slot = document.createElement("div");
      slot.className = "puzzleSlot";
      slot.dataset.index = String(idx);

      slot.style.left = `${c * slotW + 8}px`;
      slot.style.top = `${r * slotH + 8}px`;
      slot.style.width = `${slotW - 16}px`;
      slot.style.height = `${slotH - 16}px`;

      puzzleBoard.appendChild(slot);

      slots.push({
        idx,
        x: c * slotW + 8,
        y: r * slotH + 8,
        cx: c * slotW + slotW / 2,
        cy: r * slotH + slotH / 2
      });
    }
  }

  const pieces = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const idx = r * cols + c;

      const piece = document.createElement("div");
      piece.className = "puzzlePiece";
      piece.style.setProperty("--img", `url("${PUZZLE_PHOTO}")`);
      piece.dataset.correct = String(idx);

      piece.style.width = `${slotW - 16}px`;
      piece.style.height = `${slotH - 16}px`;

      piece.style.backgroundSize = `${cols * 100}% ${rows * 100}%`;
      piece.style.backgroundPosition = `${(c / (cols - 1)) * 100}% ${(r / (rows - 1)) * 100}%`;

      puzzleBoard.appendChild(piece);
      pieces.push(piece);
    }
  }

  pieces.sort(() => Math.random() - 0.5);
  const pileX = rect.width * 0.10;
  const pileY = rect.height * 0.58;

  pieces.forEach((p, i) => {
    const jitterX = (i % 3) * 10 + (Math.random() * 10);
    const jitterY = Math.floor(i / 3) * 12 + (Math.random() * 10);
    p.style.left = `${pileX + jitterX}px`;
    p.style.top = `${pileY + jitterY}px`;
  });

  pieces.forEach((piece) => {
    let startX = 0,
      startY = 0,
      origX = 0,
      origY = 0,
      dragging = false;

    piece.addEventListener("pointerdown", (e) => {
      if (piece.classList.contains("locked")) return;
      dragging = true;
      piece.classList.add("dragging");
      piece.setPointerCapture(e.pointerId);

      startX = e.clientX;
      startY = e.clientY;
      origX = parseFloat(piece.style.left);
      origY = parseFloat(piece.style.top);

      e.preventDefault();
    });

    piece.addEventListener("pointermove", (e) => {
      if (!dragging) return;
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      piece.style.left = `${origX + dx}px`;
      piece.style.top = `${origY + dy}px`;
    });

    piece.addEventListener("pointerup", () => {
      if (!dragging) return;
      dragging = false;
      piece.classList.remove("dragging");

      const correct = parseInt(piece.dataset.correct, 10);
      const slot = slots[correct];

      const px = parseFloat(piece.style.left) + (slotW - 16) / 2;
      const py = parseFloat(piece.style.top) + (slotH - 16) / 2;

      const dist = Math.hypot(px - slot.cx, py - slot.cy);
      const threshold = Math.min(slotW, slotH) * 0.30;

      if (dist < threshold) {
        piece.style.left = `${slot.x}px`;
        piece.style.top = `${slot.y}px`;
        piece.classList.add("locked");

        puzzleLockedCount++;
        if (puzzleBadge) puzzleBadge.textContent = `${puzzleLockedCount}/6`;

        vibrate(12);

        if (puzzleLockedCount === 6 && !puzzleDone) {
          puzzleDone = true;
          puzzleBoard.classList.add("done");

          if (puzzleText) puzzleText.textContent = "Με αγαπάς ακόμα; 💘";
          if (puzzleMini) puzzleMini.classList.remove("hidden");
          if (btnNext2) btnNext2.classList.remove("hidden");

          vibrate(25);
        }
      }
    });

    piece.addEventListener("pointercancel", () => {
      dragging = false;
      piece.classList.remove("dragging");
    });
  });
}

if (btnPuzzleReset) {
  btnPuzzleReset.addEventListener("click", () => {
    vibrate(12);
    initPuzzle();
  });
}

// ===== HOLD WORDS (3s) =====
let holdingWords = false;
let wordsRaf = null;
let wordsProgress = 0; // 0..1
let wordsLastT = 0;
let wordsDone = false;

const WORDS_HOLD_MS = 3000;

function setWordsUI(p) {
  const x = Math.max(0, Math.min(1, p));
  if (holdWordsBarFill) holdWordsBarFill.style.width = `${(x * 100).toFixed(0)}%`;

  if (!holdWordsBig) return;
  if (x < 0.34) holdWordsBig.textContent = "Εγώ";
  else if (x < 0.67) holdWordsBig.textContent = "Εσύ";
  else holdWordsBig.textContent = "Εμείς";
}

function wordsTick(t) {
  if (!holdingWords) return;

  if (!wordsLastT) wordsLastT = t;
  const dt = t - wordsLastT;
  wordsLastT = t;

  wordsProgress += dt / WORDS_HOLD_MS;
  if (wordsProgress > 1) wordsProgress = 1;

  setWordsUI(wordsProgress);

  if (wordsProgress > 0.34 && wordsProgress < 0.34 + dt / WORDS_HOLD_MS) vibrate(10);
  if (wordsProgress > 0.67 && wordsProgress < 0.67 + dt / WORDS_HOLD_MS) vibrate(12);

  if (wordsProgress >= 1) {
    holdingWords = false;
    wordsLastT = 0;
    wordsDone = true;

    if (holdWordsWrap) {
      holdWordsWrap.classList.add("done");
      holdWordsWrap.classList.remove("is-holding");
    }

    if (holdWordsBig) holdWordsBig.textContent = "Εμείς";
    if (holdWordsHint) holdWordsHint.textContent = "🥹 Αυτό θέλω.";

    if (btnNextHoldWords) btnNextHoldWords.classList.remove("hidden");

    vibrate(20);
    return;
  }

  wordsRaf = requestAnimationFrame(wordsTick);
}

function startWordsHold() {
  if (wordsDone) return;
  holdingWords = true;
  wordsLastT = 0;

  if (holdWordsWrap) holdWordsWrap.classList.add("is-holding");
  if (holdWordsHint) holdWordsHint.textContent = "Μη σταματήσεις…";

  vibrate(8);
  wordsRaf = requestAnimationFrame(wordsTick);
}

function endWordsHold() {
  if (!holdingWords) return;
  holdingWords = false;
  wordsLastT = 0;
  if (wordsRaf) cancelAnimationFrame(wordsRaf);

  if (holdWordsWrap) holdWordsWrap.classList.remove("is-holding");

  if (!wordsDone) {
    wordsProgress = Math.max(0, wordsProgress - 0.18);
    setWordsUI(wordsProgress);
    if (holdWordsHint) holdWordsHint.textContent = "Κράτα για 3 δευτερόλεπτα 💘";
  }
}

if (holdWordsWrap) {
  holdWordsWrap.addEventListener("pointerdown", startWordsHold);
  holdWordsWrap.addEventListener("pointerup", endWordsHold);
  holdWordsWrap.addEventListener("pointercancel", endWordsHold);
  holdWordsWrap.addEventListener("pointerleave", endWordsHold);
}

// ===== INIT =====
applyReveal(0);
showStep(0);
setProgress();
