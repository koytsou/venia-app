import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

import { deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";
import { deleteObject } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

async function deleteMoment(momentId) {
  const m = momentsList.find(x => x.id === momentId);
  if (!m) return;

  if (!confirm("Να διαγραφεί η στιγμή;")) return;

  // 1. σβήσε εικόνα
  if (m.imagePath) {
    await deleteObject(ref(storage, m.imagePath));
  }

  // 2. σβήσε document
  await deleteDoc(doc(db, "couple", COUPLE_ID, "moments", momentId));
}


// ================== FIREBASE ==================
const firebaseConfig = {
  apiKey: "AIzaSyAn_ixvznJyd2v_YamVjUvFBq8OsBI6xfE",
  authDomain: "venia-app.firebaseapp.com",
  projectId: "venia-app",
  storageBucket: "venia-app.firebasestorage.app",
  messagingSenderId: "735058388909",
  appId: "1:735058388909:web:c416068ae348f9af95a324"
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const storage = getStorage(fbApp);

signInAnonymously(auth).catch(console.error);

onAuthStateChanged(auth, (user) => {
  if (user) console.log("✅ Firebase OK. UID:", user.uid);
});

// ================== SETTINGS ==================
const LOCK_CODE = "140624";
const COUPLE_ID = "main";

const HER_NAME = "αγάπη μου";
const PHOTO_PATH = "assets/slide1.jpg";
const PUZZLE_PHOTO = "assets/puzzle.jpg";
const VOICE_PATH = "assets/voice.mp3";

const FUTURE_CARDS = [
  { title: "🎓 Το πτυχίο μας", text: "Να το πάρουμε μαζί. Να λέμε «τα καταφέραμε» και να το γιορτάσουμε όπως μόνο εμείς ξέρουμε. 💘", img: "assets/ptyxio.jpg" },
  { title: "📍 Ταξίδι", text: "Θέλω ένα ταξίδι μόνο για εμάς… να χαθούμε και να γελάμε όλη μέρα.", img: "assets/taxidi.jpg" },
  { title: "🏠 Σπίτι", text: "Ένα σπίτι με ζεστό φως, μουσική, και μια γωνιά που θα είναι “η γωνιά μας”.", img: "assets/spiti.jpg" }
];

// ================== DOM ==================
const lockScreen = document.getElementById("lockScreen");
const lockInput  = document.getElementById("lockInput");
const lockBtn    = document.getElementById("lockBtn");
const lockError  = document.getElementById("lockError");

const intro = document.getElementById("intro");
const btnUs = document.getElementById("btnUs");
const btnValentine = document.getElementById("btnValentine");

const steps = [...document.querySelectorAll(".step")];
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

const audioBox = document.getElementById("audioBox");

const btnNext2 = document.getElementById("btnNext2");
const btnNext4 = document.getElementById("btnNext4");
const btnNext5 = document.getElementById("btnNext5");

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

// HoldWords
const holdWordsWrap = document.getElementById("holdWordsWrap");
const holdWordsBig = document.getElementById("holdWordsBig");
const holdWordsHint = document.getElementById("holdWordsHint");
const holdWordsBarFill = document.getElementById("holdWordsBarFill");
const btnNextHoldWords = document.getElementById("btnNextHoldWords");

// Quiz DOM
const quizBox = document.getElementById("quizBox");
const btnQuizPrev = document.getElementById("btnQuizPrev");
const btnQuizNext = document.getElementById("btnQuizNext");
const quizMiniEnd = document.getElementById("quizMiniEnd");
const quizContinueWrap = document.getElementById("quizContinueWrap");
const btnQuizContinue = document.getElementById("btnQuizContinue");

// US mode DOM
const btnUsCheckin = document.getElementById("btnUsCheckin");
const btnUsMemories = document.getElementById("btnUsMemories");
const btnUsNotes = document.getElementById("btnUsNotes");
const usBox = document.getElementById("usBox");
const btnUsBack = document.getElementById("btnUsBack");
const btnUsGoVal = document.getElementById("btnUsGoVal");

// Moments step DOM
const btnMomBack = document.getElementById("btnMomBack");
const btnMomAddOpen = document.getElementById("btnMomAddOpen");
const momGrid = document.getElementById("momGrid");

const momAdd = document.getElementById("momAdd");
const momAddBackdrop = document.getElementById("momAddBackdrop");
const momentFile = document.getElementById("momentFile");
const momentCaption = document.getElementById("momentCaption");
const btnAddMoment = document.getElementById("btnAddMoment");
const momentStatus = document.getElementById("momentStatus");

// Fullscreen reels viewer
const momReels = document.getElementById("momReels");
const momReelsList = document.getElementById("momReelsList");
const momReelsClose = document.getElementById("momReelsClose");

// ================== QUIZ ==================
const QUIZ = [
  { q: "Ποιο ήταν το πρώτο μνμ μου;", options: ["Είσαι πολύ όμορφη", "Ήσουν χθες Αλχεμι;", "Ο κώλος σου είναι iconic"], correct: 1, winText: "🥹 ΝΑΙ. Το θυμάσαι τέλεια.", loseText: "😌 Όχι μωρό… ήταν το «Ήσουν χθες Αλχεμι;»." },
  { q: "Πού πήγαμε πρώτη φορά μόνες μας;", options: ["Ναύπλιο", "Αθήνα", "Χαλκίδα"], correct: 0, winText: "💘 Σωστό. Ναύπλιο και αναμνήσεις.", loseText: "🙈 Όχι… Ναύπλιο ήταν." },
  { q: "Πότε είπαμε το πρώτο «σ’ αγαπώ»;", options: ["Δεν το είπαμε", "Την πρώτη μέρα", "Στη βίλα"], correct: 2, winText: "❤️ Στη βίλα. Πάντα εκεί θα μένει.", loseText: "🥺 Όχι… στη βίλα." }
];

// ================== STATE ==================
let current = 0;
let futureIndex = 0;
let APP_MODE = null;

let puzzleLockedCount = 0;
let puzzleDone = false;

let quizIndex = 0;
let quizAnswers = Array(QUIZ.length).fill(null);

let momentsUnsub = null;
let momentsList = []; // [{id, ...data}]

// ================== HELPERS ==================
document.getElementById("pickPhoto")
  ?.addEventListener("click", () => {
    document.getElementById("momentFile").click();
  });


function vibrate(ms = 12) {
  try { if (navigator.vibrate) navigator.vibrate(ms); } catch {}
}

function esc(s) {
  return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
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
  const total = 7;
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

// ================== LOCK SCREEN ==================
function hideLock() {
  if (!lockScreen) return;
  lockScreen.classList.add("fadeOut");
  setTimeout(() => { lockScreen.style.display = "none"; }, 320);
}

function tryUnlock() {
  if (!lockInput) return;
  const val = lockInput.value.replace(/\D/g, "").trim();

  if (val === LOCK_CODE) {
    lockError?.classList.add("hidden");
    hideLock();
  } else {
    lockError?.classList.remove("hidden");
    lockInput.value = "";
    vibrate(18);
  }
}

setTimeout(() => { try { lockInput && lockInput.focus(); } catch {} }, 150);
lockBtn?.addEventListener("click", tryUnlock);
lockInput?.addEventListener("keydown", (e) => { if (e.key === "Enter") tryUnlock(); });

// ================== INTRO / MODE ==================
function openIntro() {
  if (!intro) return;
  intro.style.display = "";
  intro.classList.remove("hide");
}

function closeIntro() {
  if (!intro) return;
  intro.classList.add("hide");
  setTimeout(() => (intro.style.display = "none"), 360);

  if (APP_MODE === "valentine") goTo("stepHeart");
  else if (APP_MODE === "us") goTo("stepUs");
  else goTo("stepHeart");
}

btnValentine?.addEventListener("click", () => { APP_MODE = "valentine"; closeIntro(); });
btnUs?.addEventListener("click", () => { APP_MODE = "us"; closeIntro(); });

// ================== AUDIO ==================
if (audioBox) {
  audioBox.innerHTML = `
    <div style="opacity:.9;">Πάτα play…</div>
    <audio controls style="width:100%; margin-top:10px;">
      <source src="${VOICE_PATH}" type="audio/mpeg" />
      Ο browser δεν υποστηρίζει audio.
    </audio>
  `;
}

// ================== MOMENTS (Grid + Reels + Upload) ==================
function startMomentsListener() {
  if (momentsUnsub) momentsUnsub();

  const momentsRef = collection(db, "couple", COUPLE_ID, "moments");
  const q = query(momentsRef, orderBy("createdAt", "desc"));

  momentsUnsub = onSnapshot(q, (snap) => {
    momentsList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
    renderMomentsGrid();
  }, (err) => {
    console.error("moments listener error:", err);
    if (momGrid) momGrid.innerHTML = `<div style="opacity:.8;">❌ Δεν έχω πρόσβαση (rules).</div>`;
  });
}

function renderMomentsGrid() {
  if (!momGrid) return;

  if (!momentsList.length) {
    momGrid.innerHTML = `<div style="opacity:.8;">Δεν έχουμε ανεβάσει ακόμα στιγμές… 💘</div>`;
    return;
  }

  momGrid.innerHTML = momentsList.map((m, idx) => {
    const img = m.imageUrl || "";
    return `
      <button class="momTile" type="button" data-idx="${idx}" aria-label="moment ${idx + 1}">
        <img src="${img}" alt="moment" loading="lazy">
      </button>
    `;
  }).join("");

  [...momGrid.querySelectorAll(".momTile")].forEach(btn => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      openReels(idx);
    });
  });
}

function openReels(startIndex = 0) {
  if (!momReels || !momReelsList) return;
  if (!momentsList.length) return;

  momReelsList.innerHTML = momentsList.map(m => `
    <div class="reelItem">
      <div class="reelMedia">
        <img src="${m.imageUrl}" alt="moment">
      </div>

      <div class="reelCaption">
        <div class="reelMeta">
          <div class="reelDate">${fmtDate(m.createdAt)}</div>
          <button class="reelDelete" data-id="${m.id}" type="button">🗑️ Διαγραφή</button>
        </div>
        <div class="reelText">${esc(m.caption)}</div>
      </div>
    </div>
  `).join("");

  momReelsList.querySelectorAll(".reelDelete").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      deleteMoment(btn.dataset.id);
    });
  });

  momReels.classList.remove("hidden");
  momReels.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  requestAnimationFrame(() => {
    const items = [...momReelsList.querySelectorAll(".reelItem")];
    const el = items[startIndex] || items[0];
    if (el) el.scrollIntoView({ block: "start" });
  });
}


document.getElementById("btnCancelMoment")
  ?.addEventListener("click", closeAddMoment);



function closeReels() {
  if (!momReels) return;
  momReels.classList.add("hidden");
  momReels.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

momReelsClose?.addEventListener("click", closeReels);

// κλείσιμο με Esc (desktop)
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (momReels && !momReels.classList.contains("hidden")) closeReels();
    if (momAdd && !momAdd.classList.contains("hidden")) closeAddMoment();
    if (modal && !modal.classList.contains("hidden")) closeModalFn();
  }
});

// Add moment modal
function openAddMoment() {
  momAdd?.classList.remove("hidden");
  if (momentStatus) momentStatus.textContent = "";
}

function closeAddMoment() {
  momAdd?.classList.add("hidden");
  if (momentFile) momentFile.value = "";
  if (momentCaption) momentCaption.value = "";
  if (momentStatus) momentStatus.textContent = "";
}

btnMomAddOpen?.addEventListener("click", openAddMoment);
momAddBackdrop?.addEventListener("click", closeAddMoment);

btnAddMoment?.addEventListener("click", async () => {
  try {
    const user = auth.currentUser;
    if (!user) { if (momentStatus) momentStatus.textContent = "Περίμενε… συνδέομαι."; return; }

    const file = momentFile?.files?.[0];
    const caption = (momentCaption?.value || "").trim();

    if (!file) { if (momentStatus) momentStatus.textContent = "Διάλεξε μια φωτογραφία."; return; }
    if (!caption) { if (momentStatus) momentStatus.textContent = "Γράψε μια λεζάντα."; return; }

    btnAddMoment.disabled = true;
    if (momentStatus) momentStatus.textContent = "Ανέβασμα… ⏳";

    const safeName = file.name.replace(/[^\w.\-]+/g, "_");
    const path = `couple/${COUPLE_ID}/moments/${user.uid}/${Date.now()}_${safeName}`;
    const storageRef = ref(storage, path);

    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "couple", COUPLE_ID, "moments"), {
      caption,
      imageUrl: url,
      imagePath: path,
      createdAt: serverTimestamp(),
      createdBy: user.uid
    });

    if (momentStatus) momentStatus.textContent = "✅ Ανέβηκε! 💘";
    vibrate(16);
    setTimeout(() => closeAddMoment(), 450);
  } catch (err) {
    console.error(err);
    if (momentStatus) momentStatus.textContent = "❌ Κάτι πήγε στραβά. Δοκίμασε ξανά.";
  } finally {
    if (btnAddMoment) btnAddMoment.disabled = false;
  }
});

// ================== STEP CHANGE HOOKS ==================
function afterStepChange() {
  const active = steps[current];
  if (!active) return;

  if (active.id === "step2") requestAnimationFrame(() => requestAnimationFrame(() => initPuzzle()));

  if (active.id === "stepQuiz") {
    quizIndex = 0;
    quizAnswers = Array(QUIZ.length).fill(null);

    quizMiniEnd?.classList.add("hidden");
    quizContinueWrap?.classList.add("hidden");

    if (btnQuizNext) btnQuizNext.disabled = false;
    if (btnQuizPrev) btnQuizPrev.disabled = false;

    renderQuiz();
  }

  if (active.id === "stepMoments") {
    startMomentsListener();
  }
}

// ================== QUIZ ==================
function renderQuiz() {
  if (!quizBox) return;

  const item = QUIZ[quizIndex];
  const chosen = quizAnswers[quizIndex];

  quizBox.innerHTML = `
    <div style="font-weight:900; font-size:18px; margin-bottom:12px;">${item.q}</div>
    <div class="quizOpts">
      ${item.options.map((opt, i) => `
        <button class="quizOpt ${chosen === i ? "selected" : ""}" data-i="${i}" type="button">${opt}</button>
      `).join("")}
    </div>
    <div style="margin-top:12px; opacity:.9;">
      ${chosen !== null ? (chosen === item.correct ? item.winText : item.loseText) : ""}
    </div>
  `;

  [...quizBox.querySelectorAll(".quizOpt")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const i = parseInt(btn.dataset.i, 10);
      quizAnswers[quizIndex] = i;
      renderQuiz();
    });
  });

  if (btnQuizPrev) btnQuizPrev.disabled = quizIndex === 0;
}

btnQuizPrev?.addEventListener("click", () => {
  if (quizIndex > 0) { quizIndex--; renderQuiz(); }
});

btnQuizNext?.addEventListener("click", () => {
  if (quizAnswers[quizIndex] == null) return;

  if (quizIndex < QUIZ.length - 1) { quizIndex++; renderQuiz(); return; }

  quizMiniEnd?.classList.remove("hidden");
  quizContinueWrap?.classList.remove("hidden");

  if (btnQuizNext) btnQuizNext.disabled = true;
  if (btnQuizPrev) btnQuizPrev.disabled = true;
});

btnQuizContinue?.addEventListener("click", () => goTo("stepFuture"));

// ================== NAV ==================
btnNext2?.addEventListener("click", () => goTo("step3"));
btnNextHoldWords?.addEventListener("click", () => goTo("step4"));
btnNext4?.addEventListener("click", () => goTo("step5"));
btnNext5?.addEventListener("click", () => goTo("stepQuiz"));

// ================== FUTURE ==================
let futureDone = false;
btnFutureNext?.addEventListener("click", () => {
  if (futureDone) { goTo("step7"); return; }

  const card = FUTURE_CARDS[futureIndex % FUTURE_CARDS.length];
  if (futurePanel) {
    futurePanel.innerHTML = `
      ${card.img ? `<img class="futureImg" src="${card.img}" alt="${card.title}">` : ""}
      <div style="font-weight:950; margin-bottom:6px;">${card.title}</div>
      <div style="opacity:.9; line-height:1.45;">${card.text}</div>
    `;
  }

  futureIndex++;
  if (futureIndex >= FUTURE_CARDS.length) {
    btnFutureNext.textContent = "Συνέχεια";
    futureDone = true;
  }
});

// ================== US MODE ==================
btnUsCheckin?.addEventListener("click", () => {
  if (!usBox) return;

  usBox.innerHTML = `
    <div style="font-weight:900; margin-bottom:6px;">✅ Check-in</div>
    <div style="opacity:.9;">Σήμερα θέλω από εμάς:</div>
    <div style="margin-top:10px; display:grid; gap:8px;">
      <button class="btn ghost" type="button" id="needHug">🤗 Αγκαλιά</button>
      <button class="btn ghost" type="button" id="needTalk">💬 Να μιλήσουμε</button>
      <button class="btn ghost" type="button" id="needCalm">🕊️ Ηρεμία</button>
    </div>
    <div style="opacity:.75; font-size:13px; margin-top:8px;">(Αποθηκεύεται στο κινητό)</div>
  `;

  const save = (text) => {
    localStorage.setItem("us_last_checkin", text);
    usBox.innerHTML = `💘 Σημειώθηκε: <b>${text}</b><br><span style="opacity:.85;">(μένει στο κινητό)</span>`;
  };

  document.getElementById("needHug")?.addEventListener("click", () => save("Αγκαλιά"));
  document.getElementById("needTalk")?.addEventListener("click", () => save("Να μιλήσουμε"));
  document.getElementById("needCalm")?.addEventListener("click", () => save("Ηρεμία"));
});

btnUsMemories?.addEventListener("click", () => {
  goTo("stepMoments");
});

btnUsNotes?.addEventListener("click", () => {
  if (!usBox) return;
  const prev = localStorage.getItem("us_note") || "";
  usBox.innerHTML = `
    <div style="font-weight:900; margin-bottom:6px;">📝 Σημειώσεις</div>
    <textarea id="usNote" placeholder="Γράψε κάτι που θες να θυμόμαστε…"
      style="width:100%; min-height:100px; border-radius:14px; padding:12px; border:1px solid rgba(255,255,255,.18); background: rgba(0,0,0,.22); color:white;">${prev}</textarea>
    <div class="actionCenter" style="margin-top:10px;">
      <button class="btn primary" id="saveUsNote" type="button">Αποθήκευση</button>
    </div>
    <div style="opacity:.75; font-size:13px; margin-top:6px;">Αποθηκεύεται μόνο σε αυτό το κινητό.</div>
  `;

  document.getElementById("saveUsNote")?.addEventListener("click", () => {
    const ta = document.getElementById("usNote");
    localStorage.setItem("us_note", ta ? ta.value : "");
    usBox.innerHTML = "✅ Αποθηκεύτηκε. 💘";
  });
});

btnUsBack?.addEventListener("click", () => openIntro());
btnUsGoVal?.addEventListener("click", () => { APP_MODE = "valentine"; goTo("stepHeart"); });

// Moments step nav
btnMomBack?.addEventListener("click", () => {
  closeReels();
  closeAddMoment();
  goTo("stepUs");
});
function fmtDate(ts){
  if (!ts) return "";
  const d = ts.toDate();
  return d.toLocaleDateString("el-GR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

// ================== FINAL ==================
btnYes?.addEventListener("click", () => {
  openModal(`Το κρατάω αυτό 💘\nΧρόνια πολλά, ${HER_NAME}. Σε διαλέγω. Σήμερα και πάντα.`);
});
modalClose?.addEventListener("click", () => {
  const app = document.querySelector(".app");

  closeModalFn();

  // fade out
  app.classList.add("fadeOut");

  setTimeout(() => {
    APP_MODE = "us";
    goTo("stepUs");

    app.classList.remove("fadeOut");
    app.classList.add("fadeIn");

    setTimeout(() => {
      app.classList.remove("fadeIn");
    }, 450);
  }, 300);
});


modal?.addEventListener("click", (e) => { if (e.target === modal) closeModalFn(); });

// ================== SPARKS ==================
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

// ================== HEART HOLD ==================
let holding = false;
let raf = null;
let progress = 0;
let lastT = 0;
const HOLD_DURATION = 1200;

function applyReveal(p) {
  const x = Math.max(0, Math.min(1, p));
  if (revealImg) {
    revealImg.style.opacity = String(x);
    const blur = 14 * (1 - x);
    const bright = 0.75 + 0.25 * x;
    revealImg.style.filter = `blur(${blur.toFixed(1)}px) brightness(${bright.toFixed(2)})`;
    const scale = 1.03 - 0.03 * x;
    revealImg.style.transform = `scale(${scale.toFixed(3)})`;
  }
  if (ringFill) {
    const CIRC = 289;
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
    heartWrap?.classList.add("boom");
    setTimeout(() => heartWrap?.classList.remove("boom"), 650);
    heartWrap?.classList.remove("is-holding");
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
  heartWrap?.classList.add("is-holding");
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
  heartWrap?.classList.remove("is-holding");
  if (progress < 1 && heartText) heartText.innerHTML = "Κράτα την καρδιά πατημένη…";
}

function tapAfterComplete() { if (progress >= 1) goTo("step2"); }

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

// ================== PUZZLE ==================
function initPuzzle() {
  if (!puzzleBoard) return;

  puzzleBoard.innerHTML = "";
  puzzleLockedCount = 0;
  puzzleDone = false;

  if (puzzleText) puzzleText.textContent = "Φτιάξε την φωτογραφία για να συνεχίσουμε… 💘";
  if (puzzleBadge) puzzleBadge.textContent = "0/6";
  btnNext2?.classList.add("hidden");
  puzzleMini?.classList.add("hidden");
  puzzleBoard.classList.remove("done");

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
    const jitterX = (i % 3) * 10 + Math.random() * 10;
    const jitterY = Math.floor(i / 3) * 12 + Math.random() * 10;
    p.style.left = `${pileX + jitterX}px`;
    p.style.top = `${pileY + jitterY}px`;
  });

  pieces.forEach((piece) => {
    let startX = 0, startY = 0, origX = 0, origY = 0, dragging = false;

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
          puzzleMini?.classList.remove("hidden");
          btnNext2?.classList.remove("hidden");
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

btnPuzzleReset?.addEventListener("click", () => { vibrate(12); initPuzzle(); });

// ================== HOLD WORDS ==================
let holdingWords = false;
let wordsRaf = null;
let wordsProgress = 0;
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

  if (wordsProgress >= 1) {
    holdingWords = false;
    wordsLastT = 0;
    wordsDone = true;

    holdWordsWrap?.classList.add("done");
    holdWordsWrap?.classList.remove("is-holding");
    if (holdWordsBig) holdWordsBig.textContent = "Εμείς";
    if (holdWordsHint) holdWordsHint.textContent = "🥹 Αυτό θέλω.";
    btnNextHoldWords?.classList.remove("hidden");
    vibrate(20);
    return;
  }

  wordsRaf = requestAnimationFrame(wordsTick);
}

function startWordsHold() {
  if (wordsDone) return;
  holdingWords = true;
  wordsLastT = 0;
  holdWordsWrap?.classList.add("is-holding");
  if (holdWordsHint) holdWordsHint.textContent = "Μη σταματήσεις…";
  vibrate(8);
  wordsRaf = requestAnimationFrame(wordsTick);
}

function endWordsHold() {
  if (!holdingWords) return;
  holdingWords = false;
  wordsLastT = 0;
  if (wordsRaf) cancelAnimationFrame(wordsRaf);
  holdWordsWrap?.classList.remove("is-holding");

  if (!wordsDone) {
    wordsProgress = Math.max(0, wordsProgress - 0.18);
    setWordsUI(wordsProgress);
    if (holdWordsHint) holdWordsHint.textContent = "Κράτα για 3 δευτερόλεπτα 💘";
  }
}

holdWordsWrap?.addEventListener("pointerdown", startWordsHold);
holdWordsWrap?.addEventListener("pointerup", endWordsHold);
holdWordsWrap?.addEventListener("pointercancel", endWordsHold);
holdWordsWrap?.addEventListener("pointerleave", endWordsHold);

// ================== INIT ==================
if (revealImg) revealImg.src = PHOTO_PATH;
applyReveal(0);
setProgress();
steps.forEach((s) => s.classList.remove("active"));
