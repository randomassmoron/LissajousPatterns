// Get the canvas and its context
const canvas = document.getElementById("lissajousCanvas");
const ctx = canvas.getContext("2d");

// Set the canvas size to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Initialize parameters for the Lissajous curve
let A = 100, B = 100;  // Amplitudes
let a = 5, b = 4;      // Frequencies
let phi1 = 0, phi2 = Math.PI / 4;  // Default phase shifts
let t = 0;  // Time variable

// Get the sliders and input fields for controls
const speedSlider = document.getElementById("speedSlider");
const ampX = document.getElementById("ampX");
const ampY = document.getElementById("ampY");
const freqX = document.getElementById("freqX");
const freqY = document.getElementById("freqY");
const phi1Slider = document.getElementById("phi1");
const phi2Slider = document.getElementById("phi2");
const phi1Value = document.getElementById("phi1Value");
const phi2Value = document.getElementById("phi2Value");
const startStopButton = document.getElementById("startStopButton");
const resetButton = document.getElementById("resetButton");
const previewToggleButton = document.getElementById("previewToggleButton"); // New button for preview toggle

// Track whether the animation is running or not
let isRunning = false;
let isPreviewEnabled = true;  // Flag to toggle the preview

// Arrays to store the track points
let track = []; // Track for the path of the dot

// Function to draw the initial dot centered on the canvas
function drawInitialDot() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    const x = A * Math.sin(phi1 + Math.PI);  // Offset by π
    const y = B * Math.sin(phi2);
    
    // Draw the initial dot
    ctx.beginPath();
    ctx.arc(x + canvas.width / 2, y + canvas.height / 2, 5, 0, 2 * Math.PI);  
    ctx.fillStyle = "white";
    ctx.fill();
}

// Function to draw the preview line for the Lissajous curve
function drawPreview() {
    ctx.lineWidth = 0.5;  // Make the preview line thinner
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    
    // Loop through a small range of time to draw the preview path
    for (let time = 0; time < Math.PI * 2; time += 0.1) {
        const x = A * Math.sin(a * time + phi1 + Math.PI); // Offset by π
        const y = B * Math.sin(b * time + phi2);

        if (time === 0) {
            ctx.moveTo(x + canvas.width / 2, y + canvas.height / 2);
        } else {
            ctx.lineTo(x + canvas.width / 2, y + canvas.height / 2);
        }
    }
    
    ctx.stroke();
}

// Function to draw the Lissajous curve and its track
function drawLissajous() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

    // Draw path based on previous points in track array
    ctx.lineWidth = 1;  // Set the track line thickness to normal
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    track.forEach((point, index) => {
        if (index === 0) {
            ctx.moveTo(point.x, point.y);
        } else {
            ctx.lineTo(point.x, point.y);
        }
    });
    ctx.stroke();

    // Calculate the current dot position based on time
    const x = A * Math.sin(a * t + phi1 + Math.PI);  // Offset by π
    const y = B * Math.sin(b * t + phi2);

    // Draw the dot at the calculated position
    ctx.beginPath();
    ctx.arc(x + canvas.width / 2, y + canvas.height / 2, 5, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();

    // Add the current position to the track
    track.push({ x: x + canvas.width / 2, y: y + canvas.height / 2 });

    // Increment time variable based on speed slider
    t += parseFloat(speedSlider.value) / 1000;

    // Continue drawing if running
    if (isRunning) {
        requestAnimationFrame(drawLissajous);
    }
}

// Update parameters and synchronize sliders and inputs
function updateParams() {
    // Update amplitude, frequency, and phase shift values
    A = parseFloat(ampX.value);
    B = parseFloat(ampY.value);
    a = parseFloat(freqX.value);
    b = parseFloat(freqY.value);

    // Sync slider and numeric input for phase shifts
    phi1 = parseFloat(phi1Slider.value);
    phi2 = parseFloat(phi2Slider.value);
    phi1Value.value = phi1;
    phi2Value.value = phi2;

    // Update the initial dot to reflect parameter changes
    drawInitialDot();

    // If preview mode is enabled, redraw the preview line with the updated parameters
    if (isPreviewEnabled) {
        drawPreview();
    }
}

// Synchronize sliders with number inputs for phase shifts
phi1Slider.addEventListener("input", () => {
    phi1 = parseFloat(phi1Slider.value);
    phi1Value.value = phi1;
    updateParams();
});
phi2Slider.addEventListener("input", () => {
    phi2 = parseFloat(phi2Slider.value);
    phi2Value.value = phi2;
    updateParams();
});
phi1Value.addEventListener("input", () => {
    phi1 = parseFloat(phi1Value.value);
    phi1Slider.value = phi1;
    updateParams();
});
phi2Value.addEventListener("input", () => {
    phi2 = parseFloat(phi2Value.value);
    phi2Slider.value = phi2;
    updateParams();
});

// Update for amplitude, frequency, and speed sliders
[ampX, ampY, freqX, freqY, speedSlider].forEach(input => {
    input.addEventListener("input", updateParams);
});

// Toggle preview on/off
function togglePreview() {
    isPreviewEnabled = !isPreviewEnabled;
    if (isPreviewEnabled) {
        previewToggleButton.textContent = "Disable Preview";
        track = []; // Reset the track when enabling preview
        drawPreview(); // Draw the preview immediately
    } else {
        previewToggleButton.textContent = "Enable Preview";
        drawInitialDot(); // Just draw the initial dot when preview is disabled
    }
}

// Toggle animation on/off
function toggleAnimation() {
    isRunning = !isRunning;
    if (isRunning) {
        startStopButton.textContent = "Stop";
        drawLissajous();
    } else {
        startStopButton.textContent = "Start";
    }
}

// Reset animation and parameters
function resetAnimation() {
    isRunning = false;
    startStopButton.textContent = "Start";
    t = 0;
    track = []; // Clear track
    drawInitialDot(); // Reset the dot to initial position
}

// Event listeners for Start/Stop, Reset, and Preview buttons
startStopButton.addEventListener("click", toggleAnimation);
resetButton.addEventListener("click", resetAnimation);
previewToggleButton.addEventListener("click", togglePreview);

// Initialize parameters and draw the initial dot
updateParams();
drawInitialDot();
