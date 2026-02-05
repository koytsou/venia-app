// app.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  deleteDoc,
  doc,
  where,
  updateDoc,
  setDoc,
  getDoc,
  runTransaction,
  increment,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "https://www.gstatic.com/firebasejs/10.8.1/firebase-storage.js";

// ================== FIREBASE ==================
const firebaseConfig = {
  apiKey: "AIzaSyAn_ixvznJyd2v_YamVjUvFBq8OsBI6xfE",
  authDomain: "venia-app.firebaseapp.com",
  projectId: "venia-app",
  storageBucket: "venia-app.firebasestorage.app",
  messagingSenderId: "735058388909",
  appId: "1:735058388909:web:c416068ae348f9af95a324",
};

const fbApp = initializeApp(firebaseConfig);
const auth = getAuth(fbApp);
const db = getFirestore(fbApp);
const storage = getStorage(fbApp);

// auth ready helper (anonymous, χωρίς UI)
let authReadyResolve;
const authReady = new Promise((res) => (authReadyResolve = res));

signInAnonymously(auth).catch(console.error);
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("✅ Firebase OK. UID:", user.uid);
    authReadyResolve?.();
  }
});

// ================== SETTINGS ==================
const LOCK_CODE = "140624";
const COUPLE_ID = "main";

const HER_NAME = "αγάπη μου";
const PHOTO_PATH = "assets/slide1.jpg";
const PUZZLE_PHOTO = "assets/puzzle.jpg";
const VOICE_PATH = "assets/voice.mp3";

const FUTURE_CARDS = [
  {
    title: "🎓 Το πτυχίο μας",
    text: "Να το πάρουμε μαζί. Να λέμε «τα καταφέραμε» και να το γιορτάσουμε όπως μόνο εμείς ξέρουμε. 💘",
    img: "assets/ptyxio.jpg",
  },
  {
    title: "📍 Ταξίδι",
    text: "Θέλω ένα ταξίδι μόνο για εμάς… να χαθούμε και να γελάμε όλη μέρα.",
    img: "assets/taxidi.jpg",
  },
  {
    title: "🏠 Σπίτι",
    text: "Ένα σπίτι με ζεστό φως, μουσική, και μια γωνιά που θα είναι “η γωνιά μας”.",
    img: "assets/spiti.jpg",
  },
];

// ================== DOM ==================
const appEl = document.querySelector(".app");

// lock
const lockScreen = document.getElementById("lockScreen");
const lockInput = document.getElementById("lockInput");
const lockBtn = document.getElementById("lockBtn");
const lockError = document.getElementById("lockError");

// intro
const intro = document.getElementById("intro");
const btnUs = document.getElementById("btnUs");
const btnValentine = document.getElementById("btnValentine");

// steps / progress
const steps = [...document.querySelectorAll(".step")];
const progressFill = document.getElementById("progressFill");
const progressText = document.getElementById("progressText");

// audio
const audioBox = document.getElementById("audioBox");

// buttons nav
const btnNext2 = document.getElementById("btnNext2");
const btnNext4 = document.getElementById("btnNext4");
const btnNext5 = document.getElementById("btnNext5");
const btnNextHoldWords = document.getElementById("btnNextHoldWords");

const futurePanel = document.getElementById("futurePanel");
const btnFutureNext = document.getElementById("btnFutureNext");

const btnYes = document.getElementById("btnYes");

// modal
const modal = document.getElementById("modal");
const modalText = document.getElementById("modalText");
const modalClose = document.getElementById("modalClose");

// heart step
const heartWrap = document.getElementById("heartWrap");
const heartIcon = document.getElementById("heartIcon");
const heartText = document.getElementById("heartText");
const revealImg = document.getElementById("revealImg");
const holdHint = document.getElementById("holdHint");
const ringFill = document.getElementById("ringFill");
const sparks = document.getElementById("sparks");

// puzzle
const puzzleBoard = document.getElementById("puzzleBoard");
const puzzleText = document.getElementById("puzzleText");
const puzzleBadge = document.getElementById("puzzleBadge");
const btnPuzzleReset = document.getElementById("btnPuzzleReset");
const puzzleMini = document.getElementById("puzzleMini");

// hold words
const holdWordsWrap = document.getElementById("holdWordsWrap");
const holdWordsBig = document.getElementById("holdWordsBig");
const holdWordsHint = document.getElementById("holdWordsHint");
const holdWordsBarFill = document.getElementById("holdWordsBarFill");

// quiz
const quizBox = document.getElementById("quizBox");
const btnQuizPrev = document.getElementById("btnQuizPrev");
const btnQuizNext = document.getElementById("btnQuizNext");
const quizMiniEnd = document.getElementById("quizMiniEnd");
const quizContinueWrap = document.getElementById("quizContinueWrap");
const btnQuizContinue = document.getElementById("btnQuizContinue");

// us mode
const btnUsCheckin = document.getElementById("btnUsCheckin"); // "Ερώτηση Ημέρας"
const btnUsMemories = document.getElementById("btnUsMemories");
const btnUsNotes = document.getElementById("btnUsNotes");
const usBox = document.getElementById("usBox");
const btnUsBack = document.getElementById("btnUsBack");
const btnUsGoVal = document.getElementById("btnUsGoVal");

// moments page
const btnMomBack = document.getElementById("btnMomBack");
const btnMomAddOpen = document.getElementById("btnMomAddOpen");
const momGrid = document.getElementById("momGrid");

// add moment modal
const momAdd = document.getElementById("momAdd");
const momAddBackdrop = document.getElementById("momAddBackdrop");
const momentFile = document.getElementById("momentFile");
const momentCaption = document.getElementById("momentCaption");
const btnAddMoment = document.getElementById("btnAddMoment");
const momentStatus = document.getElementById("momentStatus");
const btnCancelMoment = document.getElementById("btnCancelMoment");
const pickPhoto = document.getElementById("pickPhoto");

// reels viewer
const momReels = document.getElementById("momReels");
const momReelsList = document.getElementById("momReelsList");
const momReelsClose = document.getElementById("momReelsClose");

// diary calendar page
const btnDiaryBack = document.getElementById("btnDiaryBack");
const btnDiaryAddOpen = document.getElementById("btnDiaryAddOpen");
const calPrev = document.getElementById("calPrev");
const calNext = document.getElementById("calNext");
const calTitle = document.getElementById("calTitle");
const calWeekdays = document.getElementById("calWeekdays");
const calGrid = document.getElementById("calGrid");

const calDayTitle = document.getElementById("calDayTitle");
const calDayHint = document.getElementById("calDayHint");

const diaryListFull = document.getElementById("diaryListFull");
const diaryText = document.getElementById("diaryText");
const diaryStatus = document.getElementById("diaryStatus");
const diarySave = document.getElementById("diarySave");
const diaryCancelEdit = document.getElementById("diaryCancelEdit");

// ================== QUIZ DATA ==================
const QUIZ = [
  {
    q: "Ποιο ήταν το πρώτο μνμ μου;",
    options: ["Είσαι πολύ όμορφη", "Ήσουν χθες Αλχεμι;", "Ο κώλος σου είναι iconic"],
    correct: 1,
    winText: "🥹 ΝΑΙ. Το θυμάσαι τέλεια.",
    loseText: "😌 Όχι μωρό… ήταν το «Ήσουν χθες Αλχεμι;».",
  },
  {
    q: "Πού πήγαμε πρώτη φορά μόνες μας;",
    options: ["Ναύπλιο", "Αθήνα", "Χαλκίδα"],
    correct: 0,
    winText: "💘 Σωστό. Ναύπλιο και αναμνήσεις.",
    loseText: "🙈 Όχι… Ναύπλιο ήταν.",
  },
  {
    q: "Πότε είπαμε το πρώτο «σ’ αγαπώ»;",
    options: ["Δεν το είπαμε", "Την πρώτη μέρα", "Στη βίλα"],
    correct: 2,
    winText: "❤️ Στη βίλα. Πάντα εκεί θα μένει.",
    loseText: "🥺 Όχι… στη βίλα.",
  },
];

// ================== STATE ==================
let current = 0;
let previousStepId = null;

let futureIndex = 0;
let futureDone = false;
let APP_MODE = null;

let puzzleLockedCount = 0;
let puzzleDone = false;

let quizIndex = 0;
let quizAnswers = Array(QUIZ.length).fill(null);

let momentsUnsub = null;
let momentsList = [];

// calendar diary state
let diaryDayUnsub = null;
let diaryDayList = [];
let monthMarksUnsub = null;
let markedDays = new Set();

let calView = new Date();
let selectedDayKey = null;

// edit mode
let editingEntryId = null;
let editingOriginalText = "";

// daily QA listeners
let dailyQAUnsub = null;
let streakUnsub = null;

// ================== HELPERS ==================
function vibrate(ms = 12) {
  try {
    if (navigator.vibrate) navigator.vibrate(ms);
  } catch {}
}
function esc(s) {
  return (s || "").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function setProgress() {
  const total = 7;
  const value = Math.min(Math.max(current + 1, 1), total);
  const pct = (value / total) * 100;
  if (progressFill) progressFill.style.width = `${pct}%`;
  if (progressText) progressText.textContent = `${value} / ${total}`;
}
function showStep(i) {
  const prev = steps[current];
  previousStepId = prev?.id || null;

  steps.forEach((s, idx) => s.classList.toggle("active", idx === i));
  current = i;

  setProgress();
  afterStepChange();
}
function goTo(stepId) {
  const idx = steps.findIndex((s) => s.id === stepId);
  if (idx >= 0) showStep(idx);
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
function fmtDate(ts) {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toLocaleDateString("el-GR", { day: "2-digit", month: "long", year: "numeric" });
}
function fmtDateTime(ts) {
  if (!ts) return "";
  const d = ts.toDate();
  return d.toLocaleString("el-GR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function pad2(n) {
  return String(n).padStart(2, "0");
}
function toDayKey(date) {
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}-${m}-${d}`;
}
function dayKeyToLabel(dayKey) {
  const [y, m, d] = dayKey.split("-").map((x) => parseInt(x, 10));
  const dt = new Date(y, m - 1, d);
  return dt.toLocaleDateString("el-GR", { day: "2-digit", month: "long", year: "numeric" });
}
function monthLabel(date) {
  return date.toLocaleDateString("el-GR", { month: "long", year: "numeric" });
}
function autosize(el) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = el.scrollHeight + "px";
}

// ================== DAILY QUESTION (Check-in replacement) ==================
// ✅ αλλαγές:
// 1) Μόλις πατήσεις "Αποθήκευση" -> κλειδώνει για τη μέρα (δεν αλλάζει μέχρι αύριο)
// 2) Δεν δείχνει ιστορικό/τελευταία αλλαγή
// 3) Streak: μετράει μόνο όταν απαντήσετε ΚΑΙ ΟΙ ΔΥΟ την ίδια μέρα
//    Αν χαθεί έστω μία μέρα (δεν απαντήσει ένας από τους 2) -> reset (πάει 1 στο επόμενο complete)

const DAILY_QUESTIONS = [
  "Πες ένα πράγμα που εκτίμησες σήμερα σε μένα 💘",
  "Τι σου έλειψε πιο πολύ από εμάς σήμερα;",
  "Αν η μέρα μας ήταν τραγούδι, ποιο θα ήταν;",
  "Ποια στιγμή της μέρας σκέφτηκες εμένα;",
  "Πες ένα μικρό πράγμα που θες να κάνουμε μαζί αύριο;",
  "Τι θα ήθελες να ακούσεις από μένα σήμερα;",
  "Ποια ήταν η πιο γλυκιά σκέψη σου σήμερα;",
  "Πες μου ένα «ευχαριστώ» για σήμερα 💗",
  "Τι σε έκανε να χαμογελάσεις σήμερα;",
  "Ποιο είναι ένα πράγμα που μπορώ να κάνω αύριο για να σε κάνω πιο χαρούμενη/ο;",
];

// Σταθερό dayKey με ώρα Ελλάδας
function getDayKeyAthens() {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

function getYesterdayKeyAthens() {
  // παίρνουμε "σήμερα" σε Athens και αφαιρούμε 1 μέρα
  const now = new Date();
  // βρίσκουμε y-m-d σε Athens
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Athens",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const y = parseInt(parts.find((p) => p.type === "year").value, 10);
  const m = parseInt(parts.find((p) => p.type === "month").value, 10);
  const d = parseInt(parts.find((p) => p.type === "day").value, 10);

  // φτιάχνουμε local Date (δεν μας νοιάζει timezone εδώ, μόνο το dayKey)
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() - 1);
  return `${dt.getFullYear()}-${pad2(dt.getMonth() + 1)}-${pad2(dt.getDate())}`;
}

function pickQuestionForDay(dayKey) {
  let hash = 0;
  for (let i = 0; i < dayKey.length; i++) hash = (hash * 31 + dayKey.charCodeAt(i)) >>> 0;
  return DAILY_QUESTIONS[hash % DAILY_QUESTIONS.length];
}

function startStreakListener() {
  if (streakUnsub) streakUnsub();

  const streakRef = doc(db, "couple", COUPLE_ID, "streaks", "dailyQA");
  streakUnsub = onSnapshot(
    streakRef,
    (snap) => {
      const s = snap.exists() ? snap.data() : null;
      const el = document.getElementById("qa_streak_value");
      if (el) el.textContent = String(s?.currentStreak || 0);
    },
    (err) => {
      console.error("streak listener error:", err);
      const el = document.getElementById("qa_streak_value");
      if (el) el.textContent = "0";
    }
  );
}

function applyLockUI(whoKey, locked) {
  const inputId = whoKey === "giorgos" ? "qa_giorgos" : "qa_venia";
  const btnId = whoKey === "giorgos" ? "qa_save_giorgos" : "qa_save_venia";
  const badgeId = whoKey === "giorgos" ? "qa_giorgos_lock" : "qa_venia_lock";

  const ta = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const badge = document.getElementById(badgeId);

  if (ta) ta.disabled = !!locked;
  if (btn) btn.disabled = !!locked;

  if (badge) {
    badge.textContent = locked ? "🔒 Κλειδωμένο" : "";
    badge.style.opacity = locked ? "0.85" : "0";
  }
}

function startDailyQAListener(dayKey) {
  if (dailyQAUnsub) dailyQAUnsub();

  const refDoc = doc(db, "couple", COUPLE_ID, "dailyQA", dayKey);

  dailyQAUnsub = onSnapshot(
    refDoc,
    (snap) => {
      const data = snap.exists() ? snap.data() : null;

      const gEl = document.getElementById("qa_giorgos");
      const vEl = document.getElementById("qa_venia");

      const gText = data?.answers?.giorgos?.text || "";
      const vText = data?.answers?.venia?.text || "";
      const gLocked = !!data?.answers?.giorgos?.locked;
      const vLocked = !!data?.answers?.venia?.locked;

      // ενημέρωση κειμένου (χωρίς να πετάει ενώ γράφεις)
      if (gEl && document.activeElement !== gEl && gEl.value !== gText) {
        gEl.value = gText;
        autosize(gEl);
      }
      if (vEl && document.activeElement !== vEl && vEl.value !== vText) {
        vEl.value = vText;
        autosize(vEl);
      }

      // κλείδωμα UI
      applyLockUI("giorgos", gLocked);
      applyLockUI("venia", vLocked);

      // status μικρό
      const status = document.getElementById("qa_status");
      if (status) {
        if (gLocked && vLocked) status.textContent = "✅ Και οι δύο απαντήσατε σήμερα. (streak ενημερώθηκε)";
        else if (gLocked || vLocked) status.textContent = "🔒 Μία απάντηση κλείδωσε. Περιμένει ο άλλος…";
        else status.textContent = "";
      }
    },
    (err) => {
      console.error("dailyQA listener error:", err);
      const status = document.getElementById("qa_status");
      if (status) status.textContent = "❌ Δεν μπορώ να φορτώσω (rules).";
    }
  );
}

async function saveDailyAnswer(whoKey) {
  await authReady;

  const dayKey = getDayKeyAthens();
  const question = pickQuestionForDay(dayKey);

  const inputId = whoKey === "giorgos" ? "qa_giorgos" : "qa_venia";
  const btnId = whoKey === "giorgos" ? "qa_save_giorgos" : "qa_save_venia";
  const el = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  const status = document.getElementById("qa_status");

  const text = (el?.value || "").trim();
  if (!text) {
    if (status) status.textContent = "Γράψε κάτι πρώτα 💘";
    return;
  }

  const qaRef = doc(db, "couple", COUPLE_ID, "dailyQA", dayKey);
  const streakRef = doc(db, "couple", COUPLE_ID, "streaks", "dailyQA");

  try {
    if (status) status.textContent = "Αποθήκευση… ⏳";
    if (btn) btn.disabled = true;

    await runTransaction(db, async (tx) => {
      const qaSnap = await tx.get(qaRef);
      const qaData = qaSnap.exists() ? qaSnap.data() : {};

      const alreadyLocked = !!qaData?.answers?.[whoKey]?.locked;
      if (alreadyLocked) {
        // ήδη κλειδωμένο -> τίποτα
        return;
      }

      // γράφουμε απάντηση + κλειδώνουμε
      tx.set(
        qaRef,
        {
          dayKey,
          question,
          updatedAt: serverTimestamp(),
          answers: {
            [whoKey]: {
              text,
              locked: true,
              lockedAt: serverTimestamp(),
            },
          },
        },
        { merge: true }
      );

      // μετά το write, ελέγχουμε αν "και οι δύο" είναι locked
      const gLocked = whoKey === "giorgos" ? true : !!qaData?.answers?.giorgos?.locked;
      const vLocked = whoKey === "venia" ? true : !!qaData?.answers?.venia?.locked;

      const wasComplete = !!qaData?.complete;
      const nowComplete = gLocked && vLocked;

      // αν μόλις έγινε complete (και δεν ήταν ήδη)
      if (nowComplete && !wasComplete) {
        tx.set(
          qaRef,
          {
            complete: true,
            completeAt: serverTimestamp(),
          },
          { merge: true }
        );

        const sSnap = await tx.get(streakRef);
        const sData = sSnap.exists() ? sSnap.data() : {};
        const last = sData?.lastCompleteDayKey || null;

        const yesterdayKey = getYesterdayKeyAthens();

        // Αν χθες ήταν το τελευταίο complete -> +1
        // Αλλιώς -> reset σε 1
        const nextStreak = last === yesterdayKey ? (sData?.currentStreak || 0) + 1 : 1;

        tx.set(
          streakRef,
          {
            currentStreak: nextStreak,
            lastCompleteDayKey: dayKey,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
    });

    // UI κλείδωμα άμεσα (και θα έρθει και από listener)
    applyLockUI(whoKey, true);

    vibrate(14);
    // status θα το βάλει ο listener πιο σωστά, αλλά βάλε ένα γρήγορο feedback
    if (status) status.textContent = "✅ Αποθηκεύτηκε & κλειδώθηκε για σήμερα.";
  } catch (e) {
    console.error(e);
    if (status) status.textContent = "❌ Κάτι πήγε στραβά.";
    if (btn) btn.disabled = false;
    return;
  } finally {
    // αν δεν κλείδωσε (π.χ. ήδη locked), ο listener θα το κάνει disabled
    if (btn) btn.disabled = false;
  }
}

function openDailyQuestionUI() {
  if (!usBox) return;

  const dayKey = getDayKeyAthens();
  const q = pickQuestionForDay(dayKey);

  if (btnUsCheckin) btnUsCheckin.textContent = "🎯 Ερώτηση Ημέρας";

  usBox.innerHTML = `
    <div style="display:flex; justify-content:space-between; align-items:center; gap:10px; margin-bottom:8px;">
      <div style="font-weight:900;">🎯 Ερώτηση Ημέρας</div>
      <div class="panel" style="padding:8px 10px; border-radius:14px; display:flex; gap:8px; align-items:center;">
        <div style="opacity:.8;">🔥 Streak</div>
        <div id="qa_streak_value" style="font-weight:950;">0</div>
      </div>
    </div>

    <div style="opacity:.9; margin-bottom:12px; line-height:1.35;">
      <b>${esc(q)}</b><br>
      <span style="opacity:.75; font-size:13px;">(${dayKey})</span>
    </div>

    <div style="display:grid; gap:12px;">
      <div class="panel" style="padding:12px; border-radius:14px;">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
          <div style="font-weight:900;">Γιώργος</div>
          <div id="qa_giorgos_lock" style="font-size:12px; opacity:0;"></div>
        </div>

        <textarea id="qa_giorgos"
          class="diaryTextarea"
          placeholder="Γράψε εδώ…"
          style="min-height:90px; margin-top:10px;"></textarea>

        <div style="display:flex; justify-content:flex-end; margin-top:8px;">
          <button class="btn primary" id="qa_save_giorgos" type="button" style="padding:8px 12px; border-radius:12px;">
            Αποθήκευση
          </button>
        </div>
      </div>

      <div class="panel" style="padding:12px; border-radius:14px;">
        <div style="display:flex; justify-content:space-between; gap:10px; align-items:center;">
          <div style="font-weight:900;">Βένια</div>
          <div id="qa_venia_lock" style="font-size:12px; opacity:0;"></div>
        </div>

        <textarea id="qa_venia"
          class="diaryTextarea"
          placeholder="Γράψε εδώ…"
          style="min-height:90px; margin-top:10px;"></textarea>

        <div style="display:flex; justify-content:flex-end; margin-top:8px;">
          <button class="btn primary" id="qa_save_venia" type="button" style="padding:8px 12px; border-radius:12px;">
            Αποθήκευση
          </button>
        </div>
      </div>
    </div>

    <div id="qa_status" style="opacity:.85; margin-top:10px; font-size:13px;"></div>
  `;

  const gEl = document.getElementById("qa_giorgos");
  const vEl = document.getElementById("qa_venia");

  gEl?.addEventListener("input", () => autosize(gEl));
  vEl?.addEventListener("input", () => autosize(vEl));

  document.getElementById("qa_save_giorgos")?.addEventListener("click", () => saveDailyAnswer("giorgos"));
  document.getElementById("qa_save_venia")?.addEventListener("click", () => saveDailyAnswer("venia"));

  // listeners
  startDailyQAListener(dayKey);
  startStreakListener();

  // πρώτο autosize
  autosize(gEl);
  autosize(vEl);
}

// ================== LOCK SCREEN ==================
function hideLock() {
  if (!lockScreen) return;
  lockScreen.classList.add("fadeOut");
  setTimeout(() => {
    lockScreen.style.display = "none";
  }, 320);
}
function tryUnlock() {
  if (!lockInput) return;
  const val = lockInput.value.replace(/\D/g, "").trim();
  if (val === LOCK_CODE) {
    lockError?.classList.add("hidden");
    hideLock();
    openIntro();
  } else {
    lockError?.classList.remove("hidden");
    lockInput.value = "";
    vibrate(18);
  }
}
setTimeout(() => {
  try {
    lockInput && lockInput.focus();
  } catch {}
}, 150);
lockBtn?.addEventListener("click", tryUnlock);
lockInput?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") tryUnlock();
});

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
btnValentine?.addEventListener("click", () => {
  APP_MODE = "valentine";
  closeIntro();
});
btnUs?.addEventListener("click", () => {
  APP_MODE = "us";
  closeIntro();
});

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

// ================== PICK PHOTO BUTTON ==================
pickPhoto?.addEventListener("click", () => momentFile?.click());

// ================== MOMENTS (Grid + Reels + Upload) ==================
function startMomentsListener() {
  if (momentsUnsub) momentsUnsub();

  const momentsRef = collection(db, "couple", COUPLE_ID, "moments");
  const q = query(momentsRef, orderBy("createdAt", "desc"));

  momentsUnsub = onSnapshot(
    q,
    (snap) => {
      momentsList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      renderMomentsGrid();
    },
    (err) => {
      console.error("moments listener error:", err);
      if (momGrid) momGrid.innerHTML = `<div style="opacity:.8;">❌ Δεν έχω πρόσβαση (rules).</div>`;
    }
  );
}

function renderMomentsGrid() {
  if (!momGrid) return;

  if (!momentsList.length) {
    momGrid.innerHTML = `<div style="opacity:.8;">Δεν έχουμε ανεβάσει ακόμα στιγμές… 💘</div>`;
    return;
  }

  momGrid.innerHTML = momentsList
    .map((m, idx) => {
      const img = m.imageUrl || "";
      return `
        <button class="momTile" type="button" data-idx="${idx}" aria-label="moment ${idx + 1}">
          <img src="${img}" alt="moment" loading="lazy">
        </button>
      `;
    })
    .join("");

  [...momGrid.querySelectorAll(".momTile")].forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.dataset.idx, 10);
      openReels(idx);
    });
  });
}

async function deleteMoment(momentId) {
  const m = momentsList.find((x) => x.id === momentId);
  if (!m) return;

  if (!confirm("Να διαγραφεί η στιγμή;")) return;

  try {
    if (m.imagePath) await deleteObject(ref(storage, m.imagePath));
    await deleteDoc(doc(db, "couple", COUPLE_ID, "moments", momentId));
  } catch (e) {
    console.error(e);
    alert("❌ Δεν μπόρεσα να το διαγράψω.");
  }
}

function openReels(startIndex = 0) {
  if (!momReels || !momReelsList) return;
  if (!momentsList.length) return;

  momReelsList.innerHTML = momentsList
    .map(
      (m) => `
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
    `
    )
    .join("");

  momReelsList.querySelectorAll(".reelDelete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
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

  vibrate(10);
}

function closeReels() {
  if (!momReels) return;
  momReels.classList.add("hidden");
  momReels.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

momReelsClose?.addEventListener("click", closeReels);
momReelsClose?.addEventListener(
  "touchend",
  (e) => {
    e.preventDefault();
    closeReels();
  },
  { passive: false }
);
momReelsClose?.addEventListener("pointerup", closeReels);

// ================== ADD MOMENT MODAL ==================
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
btnCancelMoment?.addEventListener("click", closeAddMoment);

btnAddMoment?.addEventListener("click", async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      if (momentStatus) momentStatus.textContent = "Περίμενε… συνδέομαι.";
      return;
    }

    const file = momentFile?.files?.[0];
    const caption = (momentCaption?.value || "").trim();

    if (!file) {
      if (momentStatus) momentStatus.textContent = "Διάλεξε μια φωτογραφία.";
      return;
    }
    if (!caption) {
      if (momentStatus) momentStatus.textContent = "Γράψε μια λεζάντα.";
      return;
    }

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
      createdBy: user.uid,
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

// κλείσιμο με Esc (desktop)
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (momReels && !momReels.classList.contains("hidden")) closeReels();
    if (momAdd && !momAdd.classList.contains("hidden")) closeAddMoment();
    if (modal && !modal.classList.contains("hidden")) closeModalFn();
  }
});

// ================== CALENDAR DIARY ==================
function renderWeekdays() {
  if (!calWeekdays) return;
  const days = ["Δε", "Τρ", "Τε", "Πε", "Πα", "Σα", "Κυ"];
  calWeekdays.innerHTML = days.map((d) => `<div>${d}</div>`).join("");
}

function buildCalendarCells(viewDate) {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const first = new Date(year, month, 1);
  const jsDay = first.getDay();
  const mondayIndex = (jsDay + 6) % 7;

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells = [];
  for (let i = 0; i < 42; i++) {
    const dayNum = i - mondayIndex + 1;
    if (dayNum < 1 || dayNum > daysInMonth) {
      cells.push({ empty: true });
    } else {
      const key = `${year}-${pad2(month + 1)}-${pad2(dayNum)}`;
      cells.push({ empty: false, dayNum, key });
    }
  }
  return cells;
}

function renderCalendar() {
  if (!calGrid) return;

  if (calTitle) calTitle.textContent = monthLabel(calView);

  const todayKey = toDayKey(new Date());
  const cells = buildCalendarCells(calView);

  calGrid.innerHTML = cells
    .map((c) => {
      if (c.empty) return `<div class="calCell empty"></div>`;

      const sel = c.key === selectedDayKey ? "selected" : "";
      const today = c.key === todayKey ? "today" : "";
      const hasEntry = markedDays.has(c.key) ? "hasEntry" : "";

      return `
        <button class="calCell day ${sel} ${today} ${hasEntry}" type="button" data-key="${c.key}">
          <div class="calNum">${c.dayNum}</div>
          <div class="calDot" aria-hidden="true"></div>
        </button>
      `;
    })
    .join("");

  calGrid.querySelectorAll(".calCell.day").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.key;
      if (key) selectDay(key);
    });
  });
}

async function startDiaryMonthMarksListener() {
  await authReady;

  if (monthMarksUnsub) monthMarksUnsub();

  const y = calView.getFullYear();
  const m = calView.getMonth();

  const firstKey = `${y}-${pad2(m + 1)}-01`;
  const lastDate = new Date(y, m + 1, 0).getDate();
  const lastKey = `${y}-${pad2(m + 1)}-${pad2(lastDate)}`;

  const refDiary = collection(db, "couple", COUPLE_ID, "diaryEntries");

  const qMonth = query(
    refDiary,
    where("dayKey", ">=", firstKey),
    where("dayKey", "<=", lastKey),
    orderBy("dayKey", "asc")
  );

  monthMarksUnsub = onSnapshot(
    qMonth,
    (snap) => {
      const s = new Set();
      snap.docs.forEach((d) => {
        const data = d.data();
        if (data?.dayKey) s.add(data.dayKey);
      });
      markedDays = s;
      renderCalendar();
    },
    (err) => console.error("month marks listener error:", err)
  );
}

function startDiaryDayListener() {
  if (!selectedDayKey) return;
  if (diaryDayUnsub) diaryDayUnsub();

  const refDiary = collection(db, "couple", COUPLE_ID, "diaryEntries");
  const qDay = query(refDiary, where("dayKey", "==", selectedDayKey), orderBy("createdAt", "desc"));

  diaryDayUnsub = onSnapshot(
    qDay,
    (snap) => {
      diaryDayList = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      renderDiaryDay();
    },
    (err) => {
      console.error("diary day listener error:", err);
      if (diaryListFull) diaryListFull.innerHTML = `<div style="opacity:.8;">❌ Δεν μπορώ να φορτώσω (index/rules).</div>`;
    }
  );
}

function renderDiaryDay() {
  if (calDayTitle && selectedDayKey) calDayTitle.textContent = dayKeyToLabel(selectedDayKey);
  if (calDayHint) calDayHint.textContent = "Σημειώσεις για αυτή τη μέρα:";

  if (!diaryListFull) return;

  if (!diaryDayList.length) {
    diaryListFull.innerHTML = `<div style="opacity:.8;">Δεν έχουμε γράψει κάτι για αυτή τη μέρα… 💘</div>`;
    return;
  }

  diaryListFull.innerHTML = diaryDayList
    .map((x) => {
      return `
        <div class="diaryItem" style="margin-bottom:10px;">
          <div class="diaryMeta" style="display:flex; justify-content:space-between; align-items:flex-start; gap:10px;">
            <div style="opacity:.85; font-size:13px;">${fmtDateTime(x.createdAt)}</div>

            <div class="diaryEntryActions">
              <button class="btn ghost diaryEditBtn" data-id="${x.id}" type="button">✏️ Αλλαγή</button>
              <button class="btn ghost diaryDelBtn" data-id="${x.id}" type="button" style="color:#ff7a7a;">🗑️ Διαγραφή</button>
            </div>
          </div>

          <div class="diaryText" style="white-space:pre-wrap; margin-top:8px;">${esc(x.text || "")}</div>
        </div>
      `;
    })
    .join("");

  diaryListFull.querySelectorAll(".diaryDelBtn").forEach((btn) => {
    btn.addEventListener("click", () => deleteDiaryEntry(btn.dataset.id));
  });

  diaryListFull.querySelectorAll(".diaryEditBtn").forEach((btn) => {
    btn.addEventListener("click", () => startEditDiaryEntry(btn.dataset.id));
  });
}

function selectDay(key) {
  selectedDayKey = key;
  renderCalendar();
  startDiaryDayListener();
  stopEditMode();
}

function stopEditMode() {
  editingEntryId = null;
  editingOriginalText = "";
  if (diaryCancelEdit) diaryCancelEdit.classList.add("hidden");
  if (diarySave) diarySave.textContent = "Αποθήκευση";
  if (diaryStatus) diaryStatus.textContent = "";
  if (diaryText) diaryText.value = "";
}

function startEditDiaryEntry(entryId) {
  const item = diaryDayList.find((x) => x.id === entryId);
  if (!item) return;

  editingEntryId = entryId;
  editingOriginalText = item.text || "";

  if (diaryText) diaryText.value = item.text || "";
  if (diarySave) diarySave.textContent = "Αλλαγή";
  if (diaryCancelEdit) diaryCancelEdit.classList.remove("hidden");
  if (diaryStatus) diaryStatus.textContent = "✏️ Επεξεργασία…";
  vibrate(10);

  try {
    diaryText?.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {}
}

async function deleteDiaryEntry(entryId) {
  if (!entryId) return;

  const item = diaryDayList.find((x) => x.id === entryId);
  if (!item) return;

  if (!confirm("Να διαγραφεί αυτή η σημείωση;")) return;

  try {
    await deleteDoc(doc(db, "couple", COUPLE_ID, "diaryEntries", entryId));
    vibrate(16);

    if (diaryStatus) diaryStatus.textContent = "🗑️ Διαγράφηκε.";
    if (editingEntryId === entryId) stopEditMode();
  } catch (e) {
    console.error(e);
    alert("❌ Δεν μπόρεσα να το διαγράψω.");
  }
}

async function saveDiaryForSelectedDay() {
  await authReady;

  const text = (diaryText?.value || "").trim();
  if (!text) {
    if (diaryStatus) diaryStatus.textContent = "Γράψε κάτι πρώτα 💘";
    return;
  }
  if (!selectedDayKey) {
    if (diaryStatus) diaryStatus.textContent = "Διάλεξε μια μέρα πρώτα.";
    return;
  }

  try {
    if (diaryStatus) diaryStatus.textContent = "Αποθήκευση… ⏳";
    if (diarySave) diarySave.disabled = true;

    if (editingEntryId) {
      await updateDoc(doc(db, "couple", COUPLE_ID, "diaryEntries", editingEntryId), {
        text,
        editedAt: serverTimestamp(),
      });

      if (diaryStatus) diaryStatus.textContent = "✅ Έγινε αλλαγή.";
      vibrate(14);
      stopEditMode();
      return;
    }

    await addDoc(collection(db, "couple", COUPLE_ID, "diaryEntries"), {
      text,
      dayKey: selectedDayKey,
      createdAt: serverTimestamp(),
      createdBy: auth.currentUser?.uid || "anon",
    });

    if (diaryStatus) diaryStatus.textContent = "✅ Αποθηκεύτηκε.";
    vibrate(14);
    if (diaryText) diaryText.value = "";
  } catch (err) {
    console.error(err);
    if (diaryStatus) diaryStatus.textContent = "❌ Κάτι πήγε στραβά.";
  } finally {
    if (diarySave) diarySave.disabled = false;
  }
}

// ================== DIARY UI BUTTONS ==================
diarySave?.addEventListener("click", saveDiaryForSelectedDay);

diaryCancelEdit?.addEventListener("click", () => {
  stopEditMode();
  if (diaryStatus) diaryStatus.textContent = "Ακυρώθηκε.";
});

btnDiaryAddOpen?.addEventListener("click", () => {
  try {
    diaryText?.focus();
    diaryText?.scrollIntoView({ behavior: "smooth", block: "center" });
  } catch {}
});

btnDiaryBack?.addEventListener("click", () => goTo("stepUs"));

calPrev?.addEventListener("click", () => {
  calView = new Date(calView.getFullYear(), calView.getMonth() - 1, 1);
  renderCalendar();
  startDiaryMonthMarksListener();
});

calNext?.addEventListener("click", () => {
  calView = new Date(calView.getFullYear(), calView.getMonth() + 1, 1);
  renderCalendar();
  startDiaryMonthMarksListener();
});

// ================== STEP CHANGE HOOKS ==================
function afterStepChange() {
  const active = steps[current];
  if (!active) return;

  // cleanup όταν φεύγεις από stepUs
  if (previousStepId === "stepUs" && active.id !== "stepUs") {
    if (dailyQAUnsub) {
      dailyQAUnsub();
      dailyQAUnsub = null;
    }
    if (streakUnsub) {
      streakUnsub();
      streakUnsub = null;
    }
  }

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

  if (active.id === "stepMoments") startMomentsListener();

  if (active.id === "stepDiary") {
    renderWeekdays();
    calView = new Date();
    selectedDayKey = toDayKey(new Date());
    renderCalendar();
    startDiaryMonthMarksListener();
    startDiaryDayListener();
    stopEditMode();
  }

  // ✅ “ΑΠΟ ΤΗΝ ΑΡΧΗ” να φαίνεται η Ερώτηση Ημέρας
  if (active.id === "stepUs") {
    openDailyQuestionUI();
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
      ${item.options
        .map(
          (opt, i) => `
        <button class="quizOpt ${chosen === i ? "selected" : ""}" data-i="${i}" type="button">${opt}</button>
      `
        )
        .join("")}
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
  if (quizIndex > 0) {
    quizIndex--;
    renderQuiz();
  }
});

btnQuizNext?.addEventListener("click", () => {
  if (quizAnswers[quizIndex] == null) return;

  if (quizIndex < QUIZ.length - 1) {
    quizIndex++;
    renderQuiz();
    return;
  }

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
btnFutureNext?.addEventListener("click", () => {
  if (futureDone) {
    goTo("step7");
    return;
  }

  const card = FUTURE_CARDS[futureIndex % FUTURE_CARDS.length];
  if (futurePanel) {
    futurePanel.innerHTML = `
      ${card.img ? `<img class="futureImg" src="${card.img}" alt="${esc(card.title)}">` : ""}
      <div style="font-weight:950; margin-bottom:6px;">${esc(card.title)}</div>
      <div style="opacity:.9; line-height:1.45;">${esc(card.text)}</div>
    `;
  }

  futureIndex++;
  if (futureIndex >= FUTURE_CARDS.length) {
    btnFutureNext.textContent = "Συνέχεια";
    futureDone = true;
  }
});

// ================== US MODE ==================
btnUsCheckin?.addEventListener("click", openDailyQuestionUI);
btnUsMemories?.addEventListener("click", () => goTo("stepMoments"));
btnUsNotes?.addEventListener("click", () => goTo("stepDiary"));

btnUsBack?.addEventListener("click", () => openIntro());
btnUsGoVal?.addEventListener("click", () => {
  APP_MODE = "valentine";
  goTo("stepHeart");
});

// moments step nav
btnMomBack?.addEventListener("click", () => {
  closeReels();
  closeAddMoment();
  goTo("stepUs");
});

// ================== FINAL ==================
btnYes?.addEventListener("click", () => {
  openModal(`Το κρατάω αυτό 💘\nΧρόνια πολλά, ${HER_NAME}. Σε διαλέγω. Σήμερα και πάντα.`);
});

modalClose?.addEventListener("click", () => {
  closeModalFn();

  if (!appEl) {
    APP_MODE = "us";
    goTo("stepUs");
    return;
  }

  appEl.classList.add("fadeOut");
  setTimeout(() => {
    APP_MODE = "us";
    goTo("stepUs");

    appEl.classList.remove("fadeOut");
    appEl.classList.add("fadeIn");

    setTimeout(() => appEl.classList.remove("fadeIn"), 450);
  }, 300);
});

modal?.addEventListener("click", (e) => {
  if (e.target === modal) closeModalFn();
});

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

function tapAfterComplete() {
  if (progress >= 1) goTo("step2");
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
        cy: r * slotH + slotH / 2,
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

btnPuzzleReset?.addEventListener("click", () => {
  vibrate(12);
  initPuzzle();
});

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

// ξεκίνα πάντα στο πρώτο step (πίσω από lock/intro)
showStep(0);
