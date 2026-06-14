const STORAGE_KEY = "zeitmanagement-week";

const plan = [
  {
    id: "mo",
    short: "Mo",
    date: "15.06",
    title: "Montag, 15.06",
    kind: "Dienst · Trainingstag",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Training + Fahrt", ["Training", "Fahrt"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-12:00", "Deep Work", ["WM26-Tippspiel", "Fehler beheben", "GitHub Update"]],
      ["12:00-13:00", "Mittagessen", ["Mittagessen"]],
      ["13:00-14:00", "Leichte Aufgaben", ["Kleine Git- und Terminalübungen"]],
      ["14:00-15:00", "Vorbereitung Arbeit", ["Tasche", "Essen", "Kleidung"]],
      ["15:00-23:33", "Dienst", ["Dienst"]],
      ["00:15", "Schlafen", ["Schlafen"]],
    ],
  },
  {
    id: "di",
    short: "Di",
    date: "16.06",
    title: "Dienstag, 16.06",
    kind: "Dienst · Mobility-Tag",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Mobility", ["Mobility", "Dehnen", "Spaziergang"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-12:00", "Deep Work", ["Schichtkalender", "Abrechnung"]],
      ["12:00-13:00", "Mittagessen", ["Mittagessen"]],
      ["13:00-14:00", "Organisation", ["Dokumente organisieren"]],
      ["14:00-15:00", "Vorbereitung Arbeit", ["Tasche", "Essen", "Kleidung"]],
      ["15:00-23:33", "Dienst", ["Dienst"]],
      ["00:15", "Schlafen", ["Schlafen"]],
    ],
  },
  {
    id: "mi",
    short: "Mi",
    date: "17.06",
    title: "Mittwoch, 17.06",
    kind: "Frei · Hauptproduktivitätstag",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Krafttraining", ["Krafttraining"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-13:00", "Webentwicklung", ["Webentwicklung", "Neues Projektfeature"]],
      ["13:00-14:00", "Mittagessen", ["Mittagessen"]],
      ["14:00-16:00", "Organisation", ["Finanzen", "ETF-Kontrolle", "Hausverwaltung"]],
      ["16:00-18:00", "Freizeit", ["Freizeit"]],
    ],
  },
  {
    id: "do",
    short: "Do",
    date: "18.06",
    title: "Donnerstag, 18.06",
    kind: "Dienst · Trainingstag",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Krafttraining", ["Krafttraining"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-12:00", "Lernen", ["Terminal lernen", "Git lernen"]],
      ["12:00-13:00", "Mittagessen", ["Mittagessen"]],
      ["13:00-14:00", "Leichte Aufgaben", ["Kleinere Aufgaben"]],
      ["14:00-15:00", "Vorbereitung Arbeit", ["Tasche", "Essen", "Kleidung"]],
      ["15:00-23:33", "Dienst", ["Dienst"]],
      ["00:15", "Schlafen", ["Schlafen"]],
    ],
  },
  {
    id: "fr",
    short: "Fr",
    date: "19.06",
    title: "Freitag, 19.06",
    kind: "Dienst · Mobility-Tag",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Mobility", ["Mobility", "Cardio", "Stretching"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-12:00", "Deep Work", ["Weiterentwicklung Schichtkalender"]],
      ["12:00-13:00", "Mittagessen", ["Mittagessen"]],
      ["13:00-14:00", "Abschluss", ["Wochenaufgaben abschließen"]],
      ["14:00-15:00", "Vorbereitung Arbeit", ["Tasche", "Essen", "Kleidung"]],
      ["15:00-23:33", "Dienst", ["Dienst"]],
      ["00:15", "Schlafen", ["Schlafen"]],
    ],
  },
  {
    id: "sa",
    short: "Sa",
    date: "20.06",
    title: "Samstag, 20.06",
    kind: "Frei · Fotografie & Reiseprojekt",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück", "Tagesplanung"]],
      ["07:30-09:30", "Krafttraining", ["Krafttraining"]],
      ["09:30-10:00", "Regeneration", ["Duschen", "Regeneration"]],
      ["10:00-13:00", "Theocharis Travel Experience", ["Neue Stadtseiten", "Fotos sortieren"]],
      ["13:00-14:00", "Mittagessen", ["Mittagessen"]],
      ["14:00-16:00", "NX Studio", ["Bildbearbeitung"]],
      ["Abends", "Frei", ["Freier Abend"]],
    ],
  },
  {
    id: "so",
    short: "So",
    date: "21.06",
    title: "Sonntag, 21.06",
    kind: "Frei · Erholung & Planung",
    blocks: [
      ["07:00-07:30", "Start", ["Wasser trinken", "Frühstück"]],
      ["07:30-09:00", "Bewegung", ["Spaziergang", "Lockeres Mobility"]],
      ["09:00-11:00", "Weekly Review", ["Woche auswerten", "Offene Punkte sammeln"]],
      ["11:00-12:00", "Planung", ["Nächste Woche planen"]],
      ["14:00-17:00", "Familie & Erholung", ["Familie", "Erholung"]],
    ],
  },
];

const dayTabs = document.getElementById("dayTabs");
const timeline = document.getElementById("timeline");
const activeDayTitle = document.getElementById("activeDayTitle");
const activeDayKind = document.getElementById("activeDayKind");
const completedCounter = document.getElementById("completedCounter");
const weekProgress = document.getElementById("weekProgress");
const weekProgressText = document.getElementById("weekProgressText");
const resetDayButton = document.getElementById("resetDayButton");
const clearWeekButton = document.getElementById("clearWeekButton");
const priorityInputs = [
  document.getElementById("priorityOne"),
  document.getElementById("priorityTwo"),
  document.getElementById("priorityThree"),
];

let state = loadState();
let activeDayId = getStartDayId();

function loadState() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { done: {}, priorities: {} };
  } catch {
    return { done: {}, priorities: {} };
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getStartDayId() {
  const date = new Date();
  const dateKey = `${String(date.getDate()).padStart(2, "0")}.06`;
  return plan.find((day) => day.date === dateKey)?.id || "mo";
}

function getTaskId(dayId, blockIndex, taskIndex) {
  return `${dayId}-${blockIndex}-${taskIndex}`;
}

function getDayTasks(day) {
  return day.blocks.flatMap((block) => block[2]);
}

function getDayProgress(day) {
  const total = getDayTasks(day).length;
  const done = day.blocks.reduce((sum, block, blockIndex) => (
    sum + block[2].filter((_, taskIndex) => state.done[getTaskId(day.id, blockIndex, taskIndex)]).length
  ), 0);

  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

function getWeekProgress() {
  return plan.reduce(
    (week, day) => {
      const progress = getDayProgress(day);
      week.done += progress.done;
      week.total += progress.total;
      return week;
    },
    { done: 0, total: 0 },
  );
}

function renderTabs() {
  dayTabs.innerHTML = "";

  plan.forEach((day) => {
    const progress = getDayProgress(day);
    const button = document.createElement("button");
    button.type = "button";
    button.className = `day-tab ${day.id === activeDayId ? "active" : ""}`;
    button.innerHTML = `
      <strong>${day.short}</strong>
      <span>${day.date}</span>
      <strong class="day-score">${progress.percent}%</strong>
    `;
    button.addEventListener("click", () => {
      activeDayId = day.id;
      render();
    });
    dayTabs.appendChild(button);
  });
}

function renderPriorities(day) {
  const priorities = state.priorities[day.id] || ["", "", ""];

  priorityInputs.forEach((input, index) => {
    input.value = priorities[index] || "";
  });
}

function renderTimeline(day) {
  timeline.innerHTML = "";

  day.blocks.forEach(([time, title, tasks], blockIndex) => {
    const block = document.createElement("article");
    block.className = "time-block";
    block.innerHTML = `
      <div class="time">${time}</div>
      <div class="block-main">
        <h3>${title}</h3>
        <div class="task-list"></div>
      </div>
    `;

    const taskList = block.querySelector(".task-list");

    tasks.forEach((task, taskIndex) => {
      const taskId = getTaskId(day.id, blockIndex, taskIndex);
      const label = document.createElement("label");
      label.className = `task ${state.done[taskId] ? "done" : ""}`;
      label.innerHTML = `
        <input type="checkbox" data-task-id="${taskId}" ${state.done[taskId] ? "checked" : ""}>
        <span>${task}</span>
      `;
      taskList.appendChild(label);
    });

    timeline.appendChild(block);
  });
}

function renderProgress() {
  const progress = getWeekProgress();
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  completedCounter.textContent = `${progress.done} / ${progress.total}`;
  weekProgress.textContent = `${percent}%`;
  weekProgressText.textContent = `${progress.done} von ${progress.total} Aufgaben erledigt.`;
}

function render() {
  const activeDay = plan.find((day) => day.id === activeDayId) || plan[0];

  activeDayTitle.textContent = activeDay.title;
  activeDayKind.textContent = activeDay.kind;

  renderTabs();
  renderPriorities(activeDay);
  renderTimeline(activeDay);
  renderProgress();
}

timeline.addEventListener("change", (event) => {
  const checkbox = event.target;

  if (!checkbox.matches("input[type='checkbox']")) return;

  state.done[checkbox.dataset.taskId] = checkbox.checked;
  saveState();
  render();
});

priorityInputs.forEach((input, index) => {
  input.addEventListener("input", () => {
    state.priorities[activeDayId] = priorityInputs.map((field) => field.value.trim());
    saveState();
  });
});

resetDayButton.addEventListener("click", () => {
  Object.keys(state.done)
    .filter((taskId) => taskId.startsWith(`${activeDayId}-`))
    .forEach((taskId) => {
      delete state.done[taskId];
    });

  delete state.priorities[activeDayId];
  saveState();
  render();
});

clearWeekButton.addEventListener("click", () => {
  state = { done: {}, priorities: {} };
  saveState();
  render();
});

render();
