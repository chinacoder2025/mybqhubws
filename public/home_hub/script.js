const ELEMENTS = {
    hour: document.getElementById('hour'),
    minute: document.getElementById('minute'),
    date: document.getElementById('date'),
    countdown: document.getElementById('countdown'),
    fsBtn: document.getElementById('fs-btn'),
    weather: document.getElementById('weather'),
};

const CONFIG = {
    quietStart: 1, // 1 AM
    quietEnd: 5.5, // 5:30 AM
};

// --- Time & Layout Logic ---
function updateTime() {
    const now = new Date();
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();

    // Time
    ELEMENTS.hour.textContent = h.toString().padStart(2, '0');
    ELEMENTS.minute.textContent = m.toString().padStart(2, '0');

    // Date
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    ELEMENTS.date.textContent = now.toLocaleDateString('en-US', options);

    // Countdown
    const secondsInDay = 86400;
    const currentSeconds = (h * 3600) + (m * 60) + s;
    const remaining = secondsInDay - currentSeconds;
    ELEMENTS.countdown.textContent = `Live the remaining ${remaining.toLocaleString()}s`;

    // Quiet Hours
    const currentDecimalTime = h + (m / 60);
    const isQuiet = (currentDecimalTime >= CONFIG.quietStart && currentDecimalTime < CONFIG.quietEnd);
    if (isQuiet) document.body.classList.add('quiet-hours');
    else document.body.classList.remove('quiet-hours');

    requestAnimationFrame(updateTime);
}

// --- Weather Logic ---
async function updateWeather() {
    try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=47.6101&longitude=-122.2015&current=temperature_2m,weather_code&temperature_unit=celsius');
        const data = await response.json();
        const temp = Math.round(data.current.temperature_2m);
        const code = data.current.weather_code;

        let icon = '☁️';
        if (code === 0) icon = '☀️';
        else if (code >= 1 && code <= 3) icon = '⛅';
        else if (code >= 51 && code <= 67) icon = '🌧️';
        else if (code >= 71 && code <= 86) icon = '❄️';

        ELEMENTS.weather.innerHTML = `<span class="weather-icon">${icon}</span> ${temp}°C`;
    } catch (e) { console.error("Weather error", e); }
}

// --- ULTIMATE SLEEP FIX (Canvas Stream - "The Generator") ---
// No files. No codecs. Pure JS generated video stream.
class SleepGuard {
    constructor() {
        this.statusDiv = null;
        this.canvas = null;
        this.video = null;
    }

    init() {
        this.statusDiv = document.createElement('div');
        Object.assign(this.statusDiv.style, {
            position: 'fixed', bottom: '10px', left: '10px',
            color: 'rgba(255,255,255,0.3)', fontSize: '10px', fontFamily: 'monospace', zIndex: 9999
        });
        this.statusDiv.innerText = '⚫ Guard: Idle';
        document.body.appendChild(this.statusDiv);
    }

    activate() {
        this.statusDiv.innerText = '🟡 Guard: Starting Generator...';

        // 1. Create Canvas ("The Source")
        this.canvas = document.createElement('canvas');
        this.canvas.width = 10;
        this.canvas.height = 10;
        const ctx = this.canvas.getContext('2d');

        // Animate Canvas (Heartbeat)
        // We draw something new every second so the stream is "alive"
        setInterval(() => {
            ctx.fillStyle = ctx.fillStyle === '#000000' ? '#111111' : '#000000';
            ctx.fillRect(0, 0, 10, 10);
        }, 1000);

        // 2. Capture Stream
        let stream;
        try {
            // 1 FPS is enough to be "Video"
            stream = this.canvas.captureStream(1);
        } catch (e) {
            console.error("Capture fail", e);
            this.statusDiv.innerText = '🔴 Stream Failed';
            return;
        }

        // 3. Create Video ("The Output")
        this.video = document.createElement('video');
        Object.assign(this.video.style, {
            position: 'fixed', bottom: '0', right: '0',
            width: '1px', height: '1px', opacity: '0.01', pointerEvents: 'none'
        });

        this.video.setAttribute('playsinline', '');
        this.video.setAttribute('loop', '');
        this.video.setAttribute('muted', '');
        this.video.muted = true;

        this.video.srcObject = stream;
        document.body.appendChild(this.video);

        // 4. Play
        this.video.play()
            .then(() => {
                this.statusDiv.innerText = '🟢 Guard: LIVE STREAM (Canvas)';
                this.statusDiv.style.color = '#4ade80';
            })
            .catch(e => {
                console.error("Play fail", e);
                this.statusDiv.innerText = '🔴 Play Blocked';
            });

        this.activateAudio();
    }

    activateAudio() {
        // White Noise Buffer (Audio Engine)
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                const ctx = new AudioContext();
                const bufferSize = 2 * ctx.sampleRate;
                const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
                const output = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) output[i] = Math.random() * 0.0001;

                const noise = ctx.createBufferSource();
                noise.buffer = buffer;
                noise.loop = true;
                noise.connect(ctx.destination);
                noise.start();
                if (ctx.state === 'suspended') ctx.resume();
            }
        } catch (e) { console.error("Audio fail", e); }
    }
}

const guard = new SleepGuard();
guard.init();

// --- Interaction2 ---
ELEMENTS.fsBtn.innerHTML = "▶";
ELEMENTS.fsBtn.addEventListener('click', () => {
    guard.activate();

    // Try Fullscreen 
    try {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(() => { });
        }
    } catch (e) { }

    ELEMENTS.fsBtn.style.opacity = '0.1';
});

// Start
updateTime();
updateWeather();
setInterval(updateWeather, 900000);
