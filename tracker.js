let currentActivity = null;
let startTime = null;

function startActivity(activity) {
  if (currentActivity) {
    saveActivity(currentActivity, Math.floor((Date.now() - startTime) / 1000));
  }
  currentActivity = activity;
  startTime = Date.now();
  document.getElementById('status').textContent = `En cours : ${activity}`;
}

function saveActivity(activity, duration) {
  fetch(`https://backend.onrender.com/api/eesa/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity, duration })
  }).then(() => {
    console.log('Activité sauvegardée');
  });
}

window.onbeforeunload = () => {
  if (currentActivity && startTime) {
    saveActivity(currentActivity, Math.floor((Date.now() - startTime) / 1000));
  }
};
