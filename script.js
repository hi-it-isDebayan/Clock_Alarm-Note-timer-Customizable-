// =========================
// Customization Functionality
// =========================

// Clock Functionality
function updateDigitalClock() {
    const clock = document.getElementById('digital-clock');
    const now = new Date();
    const hours = String(now.getHours()).padStart(2,'0');
    const minutes = String(now.getMinutes()).padStart(2,'0');
    const seconds = String(now.getSeconds()).padStart(2,'0');
    clock.textContent = `${hours}:${minutes}:${seconds}`;
}

updateDigitalClock();
setInterval(updateDigitalClock, 1000);

// Analog Clock
const analogClock = document.getElementById('analog-clock');
const ctx = analogClock.getContext('2d');

function drawAnalogClock() {
    const now = new Date();
    const radius = analogClock.height / 2;
    ctx.clearRect(0, 0, analogClock.width, analogClock.height);
    ctx.translate(radius, radius);
    const clockRadius = radius * 0.90
    drawFace(ctx, clockRadius);
    drawNumbers(ctx, clockRadius);
    drawTime(ctx, clockRadius, now);
    ctx.translate(-radius, -radius);
}

function drawFace(ctx, radius) {
    // Draw white face
    ctx.beginPath();
    ctx.arc(0, 0, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();

    // Draw border
    ctx.lineWidth = radius * 0.05;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    // Draw center
    ctx.beginPath();
    ctx.arc(0, 0, radius * 0.05, 0, 2 * Math.PI);
    ctx.fillStyle = '#000000';
    ctx.fill();
}

function drawNumbers(ctx, radius) {
    ctx.font = radius * 0.15 + "px Arial";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    for(let num = 1; num <= 12; num++){
        const ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius * 0.85);
        ctx.rotate(-ang);
        ctx.fillText(num.toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius * 0.85);
        ctx.rotate(-ang);
    }
}

function drawTime(ctx, radius, now){
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    //hour
    hour = hour % 12;
    hour = (hour * Math.PI / 6) +
           (minute * Math.PI / (6 * 60)) +
           (second * Math.PI / (360 * 60));
    drawHand(ctx, hour, radius * 0.5, radius * 0.07);
    //minute
    minute = (minute * Math.PI / 30) + (second * Math.PI / (30 * 60));
    drawHand(ctx, minute, radius * 0.8, radius * 0.07);
    // second
    second = (second * Math.PI / 30);
    drawHand(ctx, second, radius * 0.9, radius * 0.02, 'red');
}

function drawHand(ctx, pos, length, width, color = '#000000') {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.moveTo(0,0);
    ctx.rotate(pos);
    ctx.lineTo(0, -length);
    ctx.stroke();
    ctx.rotate(-pos);
}

setInterval(drawAnalogClock, 1000);

// Customization Elements
const bgColorInput = document.getElementById('bg-color');
const bgImageInput = document.getElementById('bg-image');
const textColorInput = document.getElementById('text-color');
const fontFamilySelect = document.getElementById('font-family');
const resetButton = document.getElementById('reset-button');

// Load saved settings from localStorage
function loadSettings() {
    const bgColor = localStorage.getItem('bgColor');
    const bgImage = localStorage.getItem('bgImage');
    const textColor = localStorage.getItem('textColor');
    const fontFamily = localStorage.getItem('fontFamily');

    if (bgColor) {
        document.body.style.backgroundColor = bgColor;
        bgColorInput.value = bgColor;
    }

    if (bgImage) {
        document.body.style.backgroundImage = `url(${bgImage})`;
    }

    if (textColor) {
        document.getElementById('digital-clock').style.color = textColor;
        document.getElementById('analog-clock').style.borderColor = textColor;
        textColorInput.value = textColor;
    }

    if (fontFamily) {
        document.getElementById('digital-clock').style.fontFamily = fontFamily;
        fontFamilySelect.value = fontFamily;
    }
}

// Save background color
bgColorInput.addEventListener('input', (e) => {
    const color = e.target.value;
    document.body.style.backgroundColor = color;
    // Remove background image if a color is selected
    if (color) {
        document.body.style.backgroundImage = '';
        localStorage.removeItem('bgImage');
    }
    localStorage.setItem('bgColor', color);
});

// Save background image
bgImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        const imageUrl = event.target.result;
        document.body.style.backgroundImage = `url(${imageUrl})`;
        localStorage.setItem('bgImage', imageUrl);
        // Remove background color if image is selected
        document.body.style.backgroundColor = '';
        localStorage.removeItem('bgColor');
    };
    reader.readAsDataURL(file);
});

// Save text color
textColorInput.addEventListener('input', (e) => {
    const color = e.target.value;
    document.getElementById('digital-clock').style.color = color;
    document.getElementById('analog-clock').style.borderColor = color;
    localStorage.setItem('textColor', color);
});

// Save font family
fontFamilySelect.addEventListener('change', (e) => {
    const font = e.target.value;
    document.getElementById('digital-clock').style.fontFamily = font;
    localStorage.setItem('fontFamily', font);
});

// Reset to default settings
resetButton.addEventListener('click', () => {
    // Reset styles
    document.body.style.backgroundColor = '#ffffff';
    document.body.style.backgroundImage = '';
    document.getElementById('digital-clock').style.color = '#000000';
    document.getElementById('analog-clock').style.borderColor = '#000000';
    document.getElementById('digital-clock').style.fontFamily = "'Roboto', sans-serif";

    // Reset input values
    bgColorInput.value = '#ffffff';
    bgImageInput.value = '';
    textColorInput.value = '#000000';
    fontFamilySelect.value = "'Roboto', sans-serif";

    // Clear localStorage
    localStorage.removeItem('bgColor');
    localStorage.removeItem('bgImage');
    localStorage.removeItem('textColor');
    localStorage.removeItem('fontFamily');
});

// Load settings on page load
window.addEventListener('DOMContentLoaded', loadSettings);

// =========================
// Navigation Functionality
// =========================

const navButtons = document.querySelectorAll('.nav-button');
const sections = document.querySelectorAll('.section');

navButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        navButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to the clicked button
        button.classList.add('active');

        // Hide all sections
        sections.forEach(section => section.classList.remove('active'));
        // Show the target section
        const target = button.getAttribute('data-target');
        document.getElementById(target).classList.add('active');
    });
});

// =========================
// Timer Functionality
// =========================

let timerInterval;
let timerRemaining = 0;

const timerHoursInput = document.getElementById('timer-hours');
const timerMinutesInput = document.getElementById('timer-minutes');
const timerSecondsInput = document.getElementById('timer-seconds');
const startTimerButton = document.getElementById('start-timer');
const stopTimerButton = document.getElementById('stop-timer');
const resetTimerButton = document.getElementById('reset-timer');
const timerDisplay = document.getElementById('timer-display');

function updateTimerDisplay() {
    const hours = String(Math.floor(timerRemaining / 3600)).padStart(2, '0');
    const minutes = String(Math.floor((timerRemaining % 3600) / 60)).padStart(2, '0');
    const seconds = String(timerRemaining % 60).padStart(2, '0');
    timerDisplay.textContent = `${hours}:${minutes}:${seconds}`;
}

function startTimer() {
    if (timerInterval) return; // Prevent multiple intervals
    timerInterval = setInterval(() => {
        if (timerRemaining > 0) {
            timerRemaining--;
            updateTimerDisplay();
        } else {
            clearInterval(timerInterval);
            timerInterval = null;
            alert("Timer Finished!");
        }
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    stopTimer();
    const hours = parseInt(timerHoursInput.value) || 0;
    const minutes = parseInt(timerMinutesInput.value) || 0;
    const seconds = parseInt(timerSecondsInput.value) || 0;
    timerRemaining = hours * 3600 + minutes * 60 + seconds;
    updateTimerDisplay();
}

startTimerButton.addEventListener('click', () => {
    const hours = parseInt(timerHoursInput.value) || 0;
    const minutes = parseInt(timerMinutesInput.value) || 0;
    const seconds = parseInt(timerSecondsInput.value) || 0;
    timerRemaining = hours * 3600 + minutes * 60 + seconds;
    updateTimerDisplay();
    startTimer();
});

stopTimerButton.addEventListener('click', stopTimer);
resetTimerButton.addEventListener('click', resetTimer);

// =========================
// Alarm Functionality
// =========================

let alarmTime = null;
let alarmTimeout = null;

const alarmTimeInput = document.getElementById('alarm-time');
const setAlarmButton = document.getElementById('set-alarm');
const clearAlarmButton = document.getElementById('clear-alarm');
const alarmStatus = document.getElementById('alarm-status');
const alarmSound = document.getElementById('alarm-sound');

function checkAlarm() {
    if (!alarmTime) return;

    const now = new Date();
    const currentTime = now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0') + ":" + now.getSeconds().toString().padStart(2,'0');

    if (currentTime === alarmTime) {
        alarmSound.play();
        alert("Alarm Time!");
        clearAlarm();
    }
}

function setAlarm() {
    const time = alarmTimeInput.value;
    if (!time) {
        alert("Please select a valid time for the alarm.");
        return;
    }
    alarmTime = time + ":00"; // Adding seconds
    alarmStatus.textContent = `Alarm set for ${alarmTime.substring(0,5)}`;
}

function clearAlarm() {
    alarmTime = null;
    alarmStatus.textContent = "No alarm set.";
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

setAlarmButton.addEventListener('click', setAlarm);
clearAlarmButton.addEventListener('click', clearAlarm);

// Check alarm every second
setInterval(checkAlarm, 1000);

// =========================
// Notes Functionality
// =========================

const noteInput = document.getElementById('note-input');
const saveNoteButton = document.getElementById('save-note');
const notesList = document.getElementById('notes-list');

function loadNotes() {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notesList.innerHTML = '';
    notes.forEach((note, index) => {
        const noteItem = document.createElement('div');
        noteItem.classList.add('note-item');

        const noteText = document.createElement('textarea');
        noteText.value = note;
        noteText.disabled = true;
        noteItem.appendChild(noteText);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-note');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteNote(index));
        noteItem.appendChild(deleteButton);

        notesList.appendChild(noteItem);
    });
}

function saveNote() {
    const note = noteInput.value.trim();
    if (note === "") {
        alert("Cannot save an empty note.");
        return;
    }
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.push(note);
    localStorage.setItem('notes', JSON.stringify(notes));
    noteInput.value = '';
    loadNotes();
}

function deleteNote(index) {
    const notes = JSON.parse(localStorage.getItem('notes')) || [];
    notes.splice(index, 1);
    localStorage.setItem('notes', JSON.stringify(notes));
    loadNotes();
}

saveNoteButton.addEventListener('click', saveNote);

// Load notes on page load
window.addEventListener('DOMContentLoaded', loadNotes);
