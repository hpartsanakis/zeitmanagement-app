const STORAGE_KEY = "zeitmanagement-week";

const priorityMeta = {
  high: { label: "Sehr wichtig", rank: 1 },
  medium: { label: "Wichtig", rank: 2 },
  low: { label: "Normal", rank: 3 },
};

const days = [
  { id: "mo", short: "Mo", date: "15.06", title: "Montag, 15.06", kind: "Eigener Tagesplan" },
  { id: "di", short: "Di", date: "16.06", title: "Dienstag, 16.06", kind: "Eigener Tagesplan" },
  { id: "mi", short: "Mi", date: "17.06", title: "Mittwoch, 17.06", kind: "Eigener Tagesplan" },
  { id: "do", short: "Do", date: "18.06", title: "Donnerstag, 18.06", kind: "Eigener Tagesplan" },
  { id: "fr", short: "Fr", date: "19.06", title: "Freitag, 19.06", kind: "Eigener Tagesplan" },
  { id: "sa", short: "Sa", date: "20.06", title: "Samstag, 20.06", kind: "Eigener Tagesplan" },
  { id: "so", short: "So", date: "21.06", title: "Sonntag, 21.06", kind: "Eigener Tagesplan" },
];

const dayTabs = document.getElementById("dayTabs");
const timeline = document.getElementById("timeline");
const activeDayTitle = document.getElementById("activeDayTitle");
const activeDayKind = document.getElementById("activeDayKind");
const completedCounter = document.getElementById("completedCounter");
const taskTotal = document.getElementById("taskTotal");
const plannedTotal = document.getElementById("plannedTotal");
const doneTotal = document.getElementById("doneTotal");
const weekProgress = document.getElementById("weekProgress");
const weekProgressText = document.getElementById("weekProgressText");
const resetDayButton = document.getElementById("resetDayButton");
const clearWeekButton = document.getElementById("clearWeekButton");
const customTaskForm = document.getElementById("customTaskForm");
const customTaskTitle = document.getElementById("customTaskTitle");
const customTaskPriority = document.getElementById("customTaskPriority");
const customTaskDetails = document.getElementById("customTaskDetails");
const customTaskList = document.getElementById("customTaskList");
const customTaskDetail = document.getElementById("customTaskDetail");
const clearCustomTasksButton = document.getElementById("clearCustomTasksButton");
const openTaskFormButton = document.getElementById("openTaskFormButton");
const openTaskListButton = document.getElementById("openTaskListButton");
const taskFormDialog = document.getElementById("taskFormDialog");
const taskListDialog = document.getElementById("taskListDialog");
const closeTaskFormButton = document.getElementById("closeTaskFormButton");
const closeTaskListButton = document.getElementById("closeTaskListButton");
const autoPlanForm = document.getElementById("autoPlanForm");
const weeklyTasksInput = document.getElementById("weeklyTasksInput");
const workPlanInput = document.getElementById("workPlanInput");
const replaceWeekPlan = document.getElementById("replaceWeekPlan");
const openWeeklyTaskPickerButton = document.getElementById("openWeeklyTaskPickerButton");
const weeklyTaskPickerDialog = document.getElementById("weeklyTaskPickerDialog");
const closeWeeklyTaskPickerButton = document.getElementById("closeWeeklyTaskPickerButton");
const weeklyTaskPickerList = document.getElementById("weeklyTaskPickerList");
const clearWeeklyTaskSelectionButton = document.getElementById("clearWeeklyTaskSelectionButton");
const applyWeeklyTaskSelectionButton = document.getElementById("applyWeeklyTaskSelectionButton");
const scheduleForm = document.getElementById("scheduleForm");
const scheduleTaskSelect = document.getElementById("scheduleTaskSelect");
const scheduleTime = document.getElementById("scheduleTime");

let state = loadState();
let activeDayId = getStartDayId();

function loadState() {
  try {
    return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return normalizeState();
  }
}

function normalizeState(savedState = {}) {
  const weekPlan = savedState.weekPlan && typeof savedState.weekPlan === "object" ? savedState.weekPlan : {};

  days.forEach((day) => {
    if (!Array.isArray(weekPlan[day.id])) weekPlan[day.id] = [];
  });

  return {
    customTasks: Array.isArray(savedState.customTasks) ? savedState.customTasks : [],
    selectedCustomTaskId: savedState.selectedCustomTaskId || null,
    weekPlan,
  };
}

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function closeDialog(dialog) {
  if (dialog.open) dialog.close();
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getStartDayId() {
  const date = new Date();
  const dateKey = String(date.getDate()).padStart(2, "0") + ".06";
  return days.find((day) => day.date === dateKey)?.id || "mo";
}

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
  }[char]));
}

function getTask(taskId) {
  return state.customTasks.find((task) => task.id === taskId) || null;
}

function sortCustomTasks(tasks) {
  return [...tasks].sort((a, b) => (
    Number(a.done) - Number(b.done) ||
    priorityMeta[a.priority].rank - priorityMeta[b.priority].rank ||
    b.createdAt - a.createdAt
  ));
}

function sortPlanItems(items) {
  return [...items].sort((a, b) => (
    (a.time || "99:99").localeCompare(b.time || "99:99", "de") ||
    a.createdAt - b.createdAt
  ));
}

function getDayProgress(dayId) {
  const items = state.weekPlan[dayId] || [];
  const total = items.length;
  const done = items.filter((item) => item.done).length;
  return { done, total, percent: total ? Math.round((done / total) * 100) : 0 };
}

function getWeekProgress() {
  return days.reduce(
    (week, day) => {
      const progress = getDayProgress(day.id);
      week.done += progress.done;
      week.total += progress.total;
      return week;
    },
    { done: 0, total: 0 },
  );
}

function getDayIdFromText(text) {
  const value = text.toLowerCase();
  const matches = [
    ["mo", ["montag", "mo.", "mo "]],
    ["di", ["dienstag", "di.", "di "]],
    ["mi", ["mittwoch", "mi.", "mi "]],
    ["do", ["donnerstag", "do.", "do "]],
    ["fr", ["freitag", "fr.", "fr "]],
    ["sa", ["samstag", "sa.", "sa "]],
    ["so", ["sonntag", "so.", "so "]],
  ];

  return matches.find(([, names]) => names.some((name) => value.includes(name)))?.[0] || null;
}

function detectPriority(text) {
  const value = text.toLowerCase();

  if (text.startsWith("!!!") || value.includes("sehr wichtig") || value.includes("hoch")) return "high";
  if (text.startsWith("!!") || text.startsWith("!") || value.includes("wichtig")) return "medium";
  return "low";
}

function cleanTaskTitle(text) {
  return text
    .replace(/^[-*•\s]+/, "")
    .replace(/^!{1,3}\s*/, "")
    .replace(/\s*\((hoch|wichtig|normal|low|mittel|medium)\)\s*$/i, "")
    .trim();
}

function detectCategory(title) {
  const value = title.toLowerCase();

  if (/training|kraft|mobility|cardio|stretch|gesund|spazier/.test(value)) return "health";
  if (/git|github|code|web|app|terminal|entwicklung|projekt/.test(value)) return "deep";
  if (/rechnung|dokument|finanz|etf|bank|hausverwaltung|abrechnung|organ/.test(value)) return "admin";
  if (/review|planung|weekly|woche/.test(value)) return "review";
  return "general";
}

function parseWeeklyTasks(text) {
  return text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const title = cleanTaskTitle(line);
      return {
        title,
        priority: detectPriority(line),
        category: detectCategory(title),
        details: "Automatisch aus der Wochenplanung erstellt.",
      };
    })
    .filter((task) => task.title.length > 0);
}

function parseWorkPlan(text) {
  const workPlan = {};

  text.split(/\n+/).forEach((line) => {
    const dayId = getDayIdFromText(line);
    if (!dayId) return;

    const timeMatch = line.match(/(\d{1,2}:\d{2})\s*[-–]\s*(\d{1,2}:\d{2})/);
    const isFree = /frei|urlaub|off/i.test(line);

    workPlan[dayId] = isFree ? null : {
      time: timeMatch ? timeMatch[1] + "-" + timeMatch[2] : "Arbeitszeit",
      title: line.replace(/^\S+\s*/, "").trim() || "Dienst",
    };
  });

  return workPlan;
}

function getOrCreateGeneratedTask(taskInput) {
  const existing = state.customTasks.find((task) => task.title.toLowerCase() === taskInput.title.toLowerCase());

  if (existing) {
    existing.priority = taskInput.priority;
    existing.details = existing.details || taskInput.details;
    return existing;
  }

  const task = {
    id: "custom-" + Date.now() + "-" + Math.random().toString(16).slice(2),
    title: taskInput.title,
    priority: taskInput.priority,
    details: taskInput.details,
    done: false,
    createdAt: Date.now(),
  };

  state.customTasks.push(task);
  return task;
}

function getTechnique(task, dayId, slotIndex) {
  const title = task.title.toLowerCase();

  if (title.includes("dienst") || title.includes("arbeit")) return "Time Blocking: Arbeitszeit fest blocken";
  if (slotIndex === 0 && task.priority === "high") return "MIT + Deep Work: wichtigste Aufgabe zuerst";
  if (/git|github|code|web|terminal|entwicklung|projekt/.test(title)) return "Deep Work + Pomodoro 50/10";
  if (/dokument|rechnung|finanz|etf|organ|abrechnung/.test(title)) return "Batching: ähnliche Orga-Aufgaben bündeln";
  if (/training|mobility|cardio|stretch|spazier/.test(title)) return "Habit Stacking: Bewegung fest an den Morgen koppeln";
  if (dayId === "so") return "Weekly Review: auswerten und nächste Woche planen";
  return "Time Blocking: klares Zeitfenster ohne Kontextwechsel";
}

function getSuggestedSlots(dayId, hasWork) {
  if (dayId === "so") return ["09:00-10:30", "10:45-12:00", "16:00-16:45"];
  if (!hasWork) return ["10:00-12:00", "14:00-15:30", "16:00-17:00"];
  return ["10:00-12:00", "13:00-14:00", "07:30-09:00"];
}

function distributeGeneratedPlan(taskInputs, workPlan, replaceExisting) {
  if (replaceExisting) {
    days.forEach((day) => {
      state.weekPlan[day.id] = [];
    });
  }

  days.forEach((day) => {
    const work = workPlan[day.id];
    if (!work) return;

    const workTask = getOrCreateGeneratedTask({
      title: work.title.includes("Dienst") ? work.title : "Dienst",
      priority: "medium",
      details: "Arbeitszeit aus deinem Arbeitsplan: " + work.time,
    });

    state.weekPlan[day.id].push({
      id: "plan-" + Date.now() + "-work-" + day.id,
      taskId: workTask.id,
      time: work.time,
      technique: "Time Blocking: Arbeit als festen Rahmen setzen",
      done: false,
      createdAt: Date.now(),
    });
  });

  const createdTasks = taskInputs.map(getOrCreateGeneratedTask);
  const sortedTasks = sortCustomTasks(createdTasks);
  const preferredDays = ["mo", "di", "mi", "do", "fr", "sa", "so"];
  const daySlotUsage = Object.fromEntries(days.map((day) => [day.id, 0]));

  sortedTasks.forEach((task, index) => {
    const dayId = preferredDays[index % preferredDays.length];
    const hasWork = Boolean(workPlan[dayId]);
    const slots = getSuggestedSlots(dayId, hasWork);
    const slotIndex = daySlotUsage[dayId] % slots.length;

    daySlotUsage[dayId] += 1;
    state.weekPlan[dayId].push({
      id: "plan-" + Date.now() + "-" + index + "-" + Math.random().toString(16).slice(2),
      taskId: task.id,
      time: slots[slotIndex],
      technique: getTechnique(task, dayId, slotIndex),
      done: false,
      createdAt: Date.now() + index,
    });
  });

  const sundayHasReview = state.weekPlan.so.some((item) => {
    const task = getTask(item.taskId);
    return task?.title.toLowerCase().includes("weekly review");
  });

  if (!sundayHasReview) {
    const reviewTask = getOrCreateGeneratedTask({
      title: "Weekly Review und nächste Woche planen",
      priority: "medium",
      details: "Woche auswerten, offene Punkte sammeln, nächste Woche grob planen.",
    });

    state.weekPlan.so.push({
      id: "plan-" + Date.now() + "-weekly-review",
      taskId: reviewTask.id,
      time: "11:00-12:00",
      technique: "Weekly Review: reflektieren, priorisieren, planen",
      done: false,
      createdAt: Date.now(),
    });
  }
}

function getSelectedCustomTask() {
  return state.customTasks.find((task) => task.id === state.selectedCustomTaskId) || null;
}

function getWeeklyInputTitles() {
  return parseWeeklyTasks(weeklyTasksInput.value).map((task) => task.title.toLowerCase());
}

function formatTaskForWeeklyInput(task) {
  const prefix = task.priority === "high" ? "!!! " : task.priority === "medium" ? "!! " : "";
  return prefix + task.title;
}

function renderWeeklyTaskPicker() {
  const tasks = sortCustomTasks(state.customTasks);
  const selectedTitles = getWeeklyInputTitles();

  weeklyTaskPickerList.innerHTML = "";

  if (!tasks.length) {
    weeklyTaskPickerList.innerHTML = '<span class="empty-list">Noch keine Aufgaben in der Liste.</span>';
    return;
  }

  tasks.forEach((task) => {
    const label = document.createElement("label");
    label.className = "weekly-picker-item";
    label.innerHTML =
      '<input type="checkbox" value="' + task.id + '" ' + (selectedTitles.includes(task.title.toLowerCase()) ? "checked" : "") + '>' +
      '<span><strong>' + escapeHtml(task.title) + '</strong><small>' + priorityMeta[task.priority].label + '</small></span>';
    weeklyTaskPickerList.appendChild(label);
  });
}

function applyWeeklyTaskSelection() {
  const selectedIds = Array.from(weeklyTaskPickerList.querySelectorAll('input[type="checkbox"]:checked')).map((input) => input.value);
  const selectedTasks = sortCustomTasks(state.customTasks).filter((task) => selectedIds.includes(task.id));
  weeklyTasksInput.value = selectedTasks.map(formatTaskForWeeklyInput).join("\n");
  closeDialog(weeklyTaskPickerDialog);
}

function renderTabs() {
  dayTabs.innerHTML = "";

  days.forEach((day) => {
    const progress = getDayProgress(day.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "day-tab " + (day.id === activeDayId ? "active" : "");
    button.innerHTML =
      "<strong>" + day.short + "</strong>" +
      "<span>" + day.date + "</span>" +
      "<strong class=\"day-score\">" + progress.percent + "%</strong>";
    button.addEventListener("click", () => {
      activeDayId = day.id;
      render();
    });
    dayTabs.appendChild(button);
  });
}

function renderProgress() {
  const progress = getWeekProgress();
  const percent = progress.total ? Math.round((progress.done / progress.total) * 100) : 0;

  completedCounter.textContent = progress.done + " / " + progress.total;
  taskTotal.textContent = state.customTasks.length;
  plannedTotal.textContent = progress.total;
  doneTotal.textContent = progress.done;
  weekProgress.textContent = percent + "%";
  weekProgressText.textContent = progress.total
    ? progress.done + " von " + progress.total + " geplanten Aufgaben erledigt."
    : "Noch keine Aufgaben im Wochenplan.";
}

function renderScheduleSelect() {
  const tasks = sortCustomTasks(state.customTasks).filter((task) => !task.done);

  scheduleTaskSelect.innerHTML = "";

  if (!tasks.length) {
    scheduleTaskSelect.innerHTML = '<option value="">Erst Aufgabe erstellen</option>';
    scheduleTaskSelect.disabled = true;
    scheduleForm.querySelector("button").disabled = true;
    return;
  }

  scheduleTaskSelect.disabled = false;
  scheduleForm.querySelector("button").disabled = false;

  tasks.forEach((task) => {
    const option = document.createElement("option");
    option.value = task.id;
    option.textContent = priorityMeta[task.priority].label + " · " + task.title;
    scheduleTaskSelect.appendChild(option);
  });
}

function renderTimeline(dayId) {
  const items = sortPlanItems(state.weekPlan[dayId] || []);
  timeline.innerHTML = "";

  if (!items.length) {
    timeline.innerHTML = '<div class="empty-plan">Noch keine Aufgaben für diesen Tag geplant.</div>';
    return;
  }

  items.forEach((item) => {
    const task = getTask(item.taskId);
    const article = document.createElement("article");
    article.className = "planned-task " + (item.done ? "done" : "");

    if (!task) {
      article.innerHTML =
        '<div class="time">' + escapeHtml(item.time || "Ohne Zeit") + '</div>' +
        '<div class="planned-task-main"><strong>Aufgabe nicht mehr vorhanden</strong></div>' +
        '<button class="danger-button compact-button" type="button" data-remove-plan="' + item.id + '">Entfernen</button>';
      timeline.appendChild(article);
      return;
    }

    article.innerHTML =
      '<div class="time">' + escapeHtml(item.time || "Ohne Zeit") + '</div>' +
      '<label class="planned-check">' +
        '<input type="checkbox" data-plan-done="' + item.id + '" ' + (item.done ? "checked" : "") + '>' +
      '</label>' +
      '<button class="planned-task-main" type="button" data-open-task="' + task.id + '">' +
        '<strong>' + escapeHtml(task.title) + '</strong>' +
        '<span class="priority-pill priority-' + task.priority + '">' + priorityMeta[task.priority].label + '</span>' +
        '<p>' + escapeHtml(task.details || "Keine Details eingetragen.") + '</p>' +
        (item.technique ? '<small>' + escapeHtml(item.technique) + '</small>' : '') +
      '</button>' +
      '<button class="danger-button compact-button" type="button" data-remove-plan="' + item.id + '">Entfernen</button>';

    timeline.appendChild(article);
  });
}

function renderCustomTaskList() {
  const tasks = sortCustomTasks(state.customTasks);
  customTaskList.innerHTML = "";

  if (!tasks.length) {
    customTaskList.innerHTML = '<span class="empty-list">Noch keine eigenen Aufgaben.</span>';
    return;
  }

  tasks.forEach((task) => {
    const button = document.createElement("button");
    const preview = task.details || "Keine Details eingetragen.";
    button.type = "button";
    button.className = "custom-task-card " + (task.id === state.selectedCustomTaskId ? "active " : "") + (task.done ? "done" : "");
    button.innerHTML =
      '<h3>' + escapeHtml(task.title) + '</h3>' +
      '<span class="priority-pill priority-' + task.priority + '">' + priorityMeta[task.priority].label + '</span>' +
      '<p>' + (task.done ? "Erledigt · " : "") + escapeHtml(preview) + '</p>';
    button.addEventListener("click", () => {
      state.selectedCustomTaskId = task.id;
      saveState();
      renderCustomTasks();
    });
    customTaskList.appendChild(button);
  });
}

function renderCustomTaskDetail() {
  const task = getSelectedCustomTask();

  if (!task) {
    customTaskDetail.innerHTML = '<span class="empty-detail">Wähle eine Aufgabe aus der Liste.</span>';
    return;
  }

  customTaskDetail.innerHTML =
    '<span class="detail-label">' + priorityMeta[task.priority].label + '</span>' +
    '<h2>' + escapeHtml(task.title) + '</h2>' +
    '<p>' + escapeHtml(task.details || "Keine Details eingetragen.") + '</p>' +
    '<div class="detail-actions">' +
      '<button class="secondary-button" type="button" id="toggleCustomTaskButton">' +
        (task.done ? "Wieder öffnen" : "Als erledigt markieren") +
      '</button>' +
      '<button class="danger-button" type="button" id="deleteCustomTaskButton">Löschen</button>' +
    '</div>';

  document.getElementById("toggleCustomTaskButton").addEventListener("click", () => {
    task.done = !task.done;
    saveState();
    render();
  });

  document.getElementById("deleteCustomTaskButton").addEventListener("click", () => {
    state.customTasks = state.customTasks.filter((customTask) => customTask.id !== task.id);
    days.forEach((day) => {
      state.weekPlan[day.id] = state.weekPlan[day.id].filter((item) => item.taskId !== task.id);
    });
    state.selectedCustomTaskId = state.customTasks[0]?.id || null;
    saveState();
    render();
  });
}

function renderCustomTasks() {
  if (!getSelectedCustomTask()) {
    state.selectedCustomTaskId = state.customTasks[0]?.id || null;
  }

  renderCustomTaskList();
  renderCustomTaskDetail();
}

function render() {
  const activeDay = days.find((day) => day.id === activeDayId) || days[0];

  activeDayTitle.textContent = activeDay.title;
  activeDayKind.textContent = activeDay.kind;

  renderTabs();
  renderProgress();
  renderScheduleSelect();
  renderTimeline(activeDay.id);
  renderCustomTasks();
}

openWeeklyTaskPickerButton.addEventListener("click", () => {
  renderWeeklyTaskPicker();
  openDialog(weeklyTaskPickerDialog);
});

closeWeeklyTaskPickerButton.addEventListener("click", () => {
  closeDialog(weeklyTaskPickerDialog);
});

weeklyTaskPickerDialog.addEventListener("click", (event) => {
  if (event.target === weeklyTaskPickerDialog) closeDialog(weeklyTaskPickerDialog);
});

clearWeeklyTaskSelectionButton.addEventListener("click", () => {
  weeklyTaskPickerList.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.checked = false;
  });
});

applyWeeklyTaskSelectionButton.addEventListener("click", () => {
  applyWeeklyTaskSelection();
});

openTaskFormButton.addEventListener("click", () => {
  openDialog(taskFormDialog);
});

openTaskListButton.addEventListener("click", () => {
  openDialog(taskListDialog);
});

closeTaskFormButton.addEventListener("click", () => {
  closeDialog(taskFormDialog);
});

closeTaskListButton.addEventListener("click", () => {
  closeDialog(taskListDialog);
});

taskFormDialog.addEventListener("click", (event) => {
  if (event.target === taskFormDialog) closeDialog(taskFormDialog);
});

taskListDialog.addEventListener("click", (event) => {
  if (event.target === taskListDialog) closeDialog(taskListDialog);
});

autoPlanForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskInputs = parseWeeklyTasks(weeklyTasksInput.value);
  const workPlan = parseWorkPlan(workPlanInput.value);

  if (!taskInputs.length && !Object.keys(workPlan).length) return;

  distributeGeneratedPlan(taskInputs, workPlan, replaceWeekPlan.checked);
  saveState();
  render();
});

customTaskForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const title = customTaskTitle.value.trim();
  if (!title) return;

  const task = {
    id: "custom-" + Date.now(),
    title,
    priority: customTaskPriority.value,
    details: customTaskDetails.value.trim(),
    done: false,
    createdAt: Date.now(),
  };

  state.customTasks.push(task);
  state.selectedCustomTaskId = task.id;
  saveState();
  customTaskForm.reset();
  customTaskPriority.value = "high";
  closeDialog(taskFormDialog);
  openDialog(taskListDialog);
  render();
});

scheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const taskId = scheduleTaskSelect.value;
  if (!taskId) return;

  state.weekPlan[activeDayId].push({
    id: "plan-" + Date.now(),
    taskId,
    time: scheduleTime.value.trim(),
    done: false,
    createdAt: Date.now(),
  });

  scheduleTime.value = "";
  saveState();
  render();
});

timeline.addEventListener("change", (event) => {
  const checkbox = event.target;
  if (!checkbox.matches("input[data-plan-done]")) return;

  const item = state.weekPlan[activeDayId].find((planItem) => planItem.id === checkbox.dataset.planDone);
  if (!item) return;

  item.done = checkbox.checked;
  saveState();
  render();
});

timeline.addEventListener("click", (event) => {
  const openButton = event.target.closest("[data-open-task]");
  const removeButton = event.target.closest("[data-remove-plan]");

  if (openButton) {
    state.selectedCustomTaskId = openButton.dataset.openTask;
    saveState();
    renderCustomTasks();
    return;
  }

  if (removeButton) {
    state.weekPlan[activeDayId] = state.weekPlan[activeDayId].filter((item) => item.id !== removeButton.dataset.removePlan);
    saveState();
    render();
  }
});

resetDayButton.addEventListener("click", () => {
  state.weekPlan[activeDayId] = [];
  saveState();
  render();
});

clearWeekButton.addEventListener("click", () => {
  days.forEach((day) => {
    state.weekPlan[day.id] = [];
  });
  saveState();
  render();
});

clearCustomTasksButton.addEventListener("click", () => {
  state.customTasks = [];
  state.selectedCustomTaskId = null;
  days.forEach((day) => {
    state.weekPlan[day.id] = [];
  });
  saveState();
  render();
});

render();

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js").catch(() => {});
  });
}
