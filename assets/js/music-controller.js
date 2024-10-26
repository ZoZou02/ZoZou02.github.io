const audioPlayer = document.getElementById('audioPlayer');
const audioPlayerControl = document.getElementById('audioPlayerControl');
const playPauseIcon = document.getElementById('playPauseIcon');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const progressBarContainer = document.getElementById('progressBarContainer');
const progressBar = document.getElementById('progressBar');
let isDragging = false;

playPauseIcon.addEventListener('click', togglePlay);
audioPlayer.addEventListener('timeupdate', updateProgressBar);
progressBarContainer.addEventListener('click', seek);
audioPlayer.addEventListener('ended', resetPlayer);

progressBarContainer.addEventListener('mousedown', startDrag);
document.addEventListener('mousemove', drag);
document.addEventListener('mouseup', endDrag);

function togglePlay() {
    if (audioPlayer.paused) {
        audioPlayer.play();
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
    } else {
        audioPlayer.pause();
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
    }
}

function updateProgressBar() {
    if (!isDragging) {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        progressBar.style.width = `${progress}%`;
        progressBarContainer.style.setProperty('--progress', `${progress}%`);
    }
}

function seek(event) {
    const percent = event.offsetX / progressBarContainer.offsetWidth;
    audioPlayer.currentTime = percent * audioPlayer.duration;
}

function resetPlayer() {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    progressBar.style.width = '0%';
    progressBarContainer.style.setProperty('--progress', '0%');
    audioPlayer.currentTime = 0;
}

function startDrag(event) {
    isDragging = true;
    drag(event);
}

function drag(event) {
    if (isDragging) {
        const containerRect = progressBarContainer.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - containerRect.left) / containerRect.width, 0), 1);
        progressBar.style.width = `${percent * 100}%`;
        progressBarContainer.style.setProperty('--progress', `${percent * 100}%`);
    }
}

function endDrag(event) {
    if (isDragging) {
        isDragging = false;
        const containerRect = progressBarContainer.getBoundingClientRect();
        const percent = Math.min(Math.max((event.clientX - containerRect.left) / containerRect.width, 0), 1);
        audioPlayer.currentTime = percent * audioPlayer.duration;
    }
}

const volumeIcon = document.getElementById('volumeIcon');
const volumeControlContainer = document.getElementById('volumeControlContainer');

volumeIcon.addEventListener('click', () => {
    if (volumeControlContainer.style.transform === 'translate(236px, -34px)') {
        volumeControlContainer.style.transform = 'translate(310px, -34px)';
    } else {
        volumeControlContainer.style.transform ='translate(236px, -34px)';
    }
});

const volumeControl = document.getElementById('volumeControl');
volumeControl.addEventListener('input', () => {
    audioPlayer.volume = volumeControl.value;
    setTimeout(() => {
        volumeControlContainer.style.transform = 'translate(236px, -34px)';
    }, 2000);
});

document.addEventListener('click', (event) => {
    const isClickInside = volumeControlContainer.contains(event.target) || volumeIcon.contains(event.target);
    if (!isClickInside) {
        volumeControlContainer.style.transform = 'translate(236px, -34px)';
    }
});