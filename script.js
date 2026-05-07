const registrationForm = document.getElementById('registrationForm');
const registrationsBody = document.getElementById('registrationsBody');
const emptyMessage = document.getElementById('emptyMessage');
const clockElement = document.getElementById('clock');
const batteryElement = document.getElementById('battery');
const deviceTypeElement = document.getElementById('deviceType');

const STORAGE_KEY = 'cbj26Registrations';

function getRegistrations() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    return [];
  }
}

function saveRegistrations(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function renderRegistrations() {
  const registrations = getRegistrations();
  registrationsBody.innerHTML = '';

  if (!registrations.length) {
    emptyMessage.style.display = 'block';
    return;
  }

  emptyMessage.style.display = 'none';

  registrations.forEach(({ name, age, nickname, id, sex }) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${name}</td>
      <td>${age}</td>
      <td>${nickname}</td>
      <td>${id}</td>
      <td>${sex}</td>
    `;
    registrationsBody.appendChild(row);
  });
}

function showClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockElement.textContent = `${hours}:${minutes}:${seconds}`;
}

function updateDeviceType() {
  const userAgent = navigator.userAgent.toLowerCase();
  const isMobile = /mobi|android|iphone|ipad|ipod|windows phone/.test(userAgent);
  deviceTypeElement.textContent = isMobile ? 'Celular 📱' : 'Computador 💻';
}

function updateBatteryStatus() {
  if (!navigator.getBattery) {
    batteryElement.textContent = 'N/A';
    return;
  }

  navigator.getBattery().then((battery) => {
    const level = Math.round(battery.level * 100);
    batteryElement.textContent = `${level}%`;

    battery.addEventListener('levelchange', () => {
      batteryElement.textContent = `${Math.round(battery.level * 100)}%`;
    });
  }).catch(() => {
    batteryElement.textContent = 'N/A';
  });
}

function validateRegistration(data) {
  const age = Number(data.age);
  const idPattern = /^#\d{9,12}$/;

  if (!data.name.trim()) {
    return 'Por favor, informe o nome completo.';
  }

  if (!age || age < 12 || age > 15) {
    return 'A idade deve ser entre 12 e 15 anos.';
  }

  if (!data.nickname.trim()) {
    return 'Por favor, informe o nickname do jogo.';
  }

  if (!idPattern.test(data.id.trim())) {
    return 'O ID deve ser no formato real do jogo, por exemplo: #123456789.';
  }

  if (!data.sex) {
    return 'Selecione o sexo: masculino ou feminino.';
  }

  return '';
}

registrationForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(registrationForm);
  const data = {
    name: formData.get('playerName').trim(),
    age: formData.get('playerAge').trim(),
    nickname: formData.get('playerNickname').trim(),
    id: formData.get('playerId').trim(),
    sex: formData.get('playerSex'),
  };

  const error = validateRegistration(data);
  if (error) {
    alert(error);
    return;
  }

  const registrations = getRegistrations();
  registrations.push(data);
  saveRegistrations(registrations);
  renderRegistrations();

  registrationForm.reset();
  alert('Inscrição realizada com sucesso!');
});

window.addEventListener('DOMContentLoaded', () => {
  renderRegistrations();
  showClock();
  setInterval(showClock, 1000);
  updateDeviceType();
  updateBatteryStatus();
});
