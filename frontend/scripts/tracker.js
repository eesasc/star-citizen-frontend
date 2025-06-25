let isPowerOn = false;
let isStarted = false;
let activeActivity = null;
let globalTimer = 0;
let activityTimers = {
  hauling: 0,
  mining: 0,
  salvage: 0,
  bunker: 0
};
let intervalGlobal, intervalActivity;

const updateTime = (seconds) => {
  const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
  const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  return `${h}:${m}:${s}`;
};

const elements = {
  powerBtn: document.getElementById('powerBtn'),
  startBtn: document.getElementById('startBtn'),
  haulingBtn: document.getElementById('haulingBtn'),
  miningBtn: document.getElementById('miningBtn'),
  salvageBtn: document.getElementById('salvageBtn'),
  bunkerBtn: document.getElementById('bunkerBtn'),
  counterStart: document.getElementById('counter-start'),
  counterHauling: document.getElementById('counter-hauling'),
  counterMining: document.getElementById('counter-mining'),
  counterSalvage: document.getElementById('counter-salvage'),
  counterBunker: document.getElementById('counter-bunker')
};

function resetAll() {
  isStarted = false;
  clearInterval(intervalGlobal);
  clearInterval(intervalActivity);
  elements.startBtn.textContent = 'START';
  elements.startBtn.classList.remove('bg-red-500', 'text-black', 'border-red-500', 'text-red-500');
  ["hauling", "mining", "salvage", "bunker"].forEach(act => deactivateActivity(act));
}

function deactivateActivity(name) {
  clearInterval(intervalActivity);
  activeActivity = null;
  const btn = elements[`${name}Btn`];
  btn.classList.remove('bg-cyan-500', 'text-black');
}

function activateActivity(name) {
  if (!isPowerOn || !isStarted || activeActivity === name) return;
  if (activeActivity) deactivateActivity(activeActivity);
  activeActivity = name;
  const btn = elements[`${name}Btn`];
  btn.classList.add('bg-cyan-500', 'text-black');
  intervalActivity = setInterval(() => {
    activityTimers[name]++;
    elements[`counter${capitalize(name)}`].textContent = updateTime(activityTimers[name]);
  }, 1000);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

elements.powerBtn.onclick = () => {
  isPowerOn = !isPowerOn;
  elements.powerBtn.textContent = isPowerOn ? 'POWER OFF' : 'POWER ON';
  elements.powerBtn.classList.toggle('border-red-500', isPowerOn);
  elements.powerBtn.classList.toggle('text-red-500', isPowerOn);

  if (!isPowerOn) resetAll();
};

elements.startBtn.onclick = () => {
  if (!isPowerOn) return;
  isStarted = !isStarted;
  elements.startBtn.textContent = isStarted ? 'STOP' : 'START';
  elements.startBtn.classList.toggle('border-red-500', isStarted);
  elements.startBtn.classList.toggle('text-red-500', isStarted);
  if (isStarted) {
    intervalGlobal = setInterval(() => {
      globalTimer++;
      elements.counterStart.textContent = updateTime(globalTimer);
    }, 1000);
  } else {
    clearInterval(intervalGlobal);
    if (activeActivity) deactivateActivity(activeActivity);
  }
};

['hauling', 'mining', 'salvage', 'bunker'].forEach(name => {
  elements[`${name}Btn`].onclick = () => {
    if (!isPowerOn || !isStarted) return;
    if (activeActivity === name) {
      deactivateActivity(name);
    } else {
      activateActivity(name);
    }
  };
});
