const container = document.getElementById("CanvasContainer")
const canvas = document.getElementById('DeepCanvas');
const ctx = canvas.getContext('2d');
canvas.width = "1080"
canvas.height = '1920'

const ball = {
    radius: 80,
    x: 75,
    y: 75,
    dx: 3,  // Initial horizontal speed
    dy: 3,  // Initial vertical speed
    color: 'red',
    sideLength: 160,
};
const rainbowColors = [
    'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'
];
const gradientColors = [
    ['255,0,0', '139,0,0'], // Red to Dark Red
    ['139,0,0', '255,69,0'], // Dark Red to Red-Orange
    ['255,69,0', '255,140,0'], // Red-Orange to Dark Orange
    ['255,140,0', '255,165,0'], // Dark Orange to Orange
    // Add more gradient steps as needed
];
let speed = 2; // Initial speed
let increaseSpeedOnMove = false; // Control speed increase on every move
let SpeedSelectedOption = 'constantSpeed'
let strokeWidthOption = document.getElementById('strokeWidth');
let customWidth = document.getElementById('customStrokeWidth');
let selectedWidthOption = strokeWidthOption.value;
// Functions to control speed change
function increaseSpeed() {
    speed += 1;
}

function decreaseSpeed() {
    if (speed > 1) {
        speed -= 1;
    }
}
let colorIndex = 0;
let step = 0;
let animationId = null;
let colorChangeOption = 'borders';
let animationFrame = 0;
const speedIncreaseFactor = 0.05;
let selectedShape = 'circle'; 

function drawBall() {
    ctx.beginPath();
    if (selectedShape =='circle') {
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    } else if (selectedShape =='square') {
        ctx.rect(ball.x - ball.sideLength / 2, ball.y - ball.sideLength / 2, ball.sideLength, ball.sideLength);
    }
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = selectedWidthOption
    ctx.stroke();
    ctx.closePath();
}

function updateBall() {
    // Clear the canvas
    // ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update ball position
    ball.x += speed * ball.dx;
    ball.y += speed * ball.dy;

    if (increaseSpeedOnMove) {
        speed += speedIncreaseFactor; // Gradual speed increase
    }
    animationFrame++;
    // Check for collision with the canvas borders
    if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.dx = -ball.dx; // Reverse horizontal direction
        if (SpeedSelectedOption === 'constantSpeed') {

        } else if (SpeedSelectedOption === 'increaseOnBorder'){
            increaseSpeed();
        };
        playCollisionSound();
    }

    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy = -ball.dy; // Reverse vertical direction
        if (SpeedSelectedOption === 'constantSpeed') {
         
        } else if (SpeedSelectedOption === 'increaseOnBorder'){
            increaseSpeed();
        };
        playCollisionSound();
    }
    switch (colorChangeOption) {
        case 'corners':
            if (
                (ball.x - ball.radius <= 0 && ball.y - ball.radius <= 0) ||
                (ball.x + ball.radius >= canvas.width && ball.y - ball.radius <= 0) ||
                (ball.x - ball.radius <= 0 && ball.y + ball.radius >= canvas.height) ||
                (ball.x + ball.radius >= canvas.width && ball.y + ball.radius >= canvas.height)
            ) {
                ball.color = getRandomColor();
            }
            break;
            case 'borders':
            if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width || ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
                ball.color = getRandomColor();
            }
            break;
        case 'movement':
            ball.color = getRandomColor(); // Change color on every movement
            break;
        case 'gradientMovement':
                ball.color = getRandomGradientColor();
                break;
    }
    drawBall();
    requestAnimationFrame(updateBall);
}

function getRandomColor() {
    // Generate random RGB values
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);

    return `rgb(${r},${g},${b})`;
}
function getRandomGradientColor() {
    // Define an array of RGB values for the gradient colors
    const gradientColors = [
        [255, 0, 0],     // Red
        [255, 165, 0],   // Orange
        [255, 255, 0],   // Yellow
        [0, 128, 0],     // Green
        [0, 0, 255],     // Blue
        [75, 0, 130],    // Indigo
        [148, 0, 211]    // Violet
    ];

    // Define the number of colors in the gradient
    const numColors = gradientColors.length;

    // Calculate the current color index based on the animation frame
    const colorIndex = Math.floor(animationFrame / 100) % numColors;

    // Determine the start and end colors for interpolation
    const startColor = gradientColors[colorIndex];
    const endColor = gradientColors[(colorIndex + 1) % numColors];

    // Calculate the percentage of transition between colors
    const percentage = (animationFrame % 100) / 100;

    // Interpolate between the start and end colors
    const interpolatedColor = interpolateColors(startColor, endColor, percentage);

    return `rgb(${interpolatedColor[0]}, ${interpolatedColor[1]}, ${interpolatedColor[2]})`;
}

function interpolateColors(start, end, percentage) {
    const color = [];
    for (let i = 0; i < 3; i++) {
        color.push(Math.round(start[i] + (end[i] - start[i]) * percentage));
    }
    return color;
}
function playCollisionSound() {
    const soundHitBall = document.getElementById('collisionSound');
    soundHitBall.currentTime = 0; // Rewind the sound (in case it's already playing)
    soundHitBall.play();
}
// updateBall();
document.getElementById('startButton').addEventListener('click', () => {
    // Start the animation when the button is clicked
    if (animationId === null) {
        animationId = requestAnimationFrame(updateBall);
    }
});
document.getElementById('colorChangeOption').addEventListener('change', (e) => {
    // Update the selected color change option
    colorChangeOption = e.target.value;
});
document.getElementById('increaseSpeedButton').addEventListener('click', increaseSpeed);
document.getElementById('decreaseSpeedButton').addEventListener('click', decreaseSpeed);
document.getElementById('changeSpeedOption').addEventListener('change', (e) => {
    SpeedSelectedOption = e.target.value;
    increaseSpeedOnMove = SpeedSelectedOption === 'increaseOnMove';
    // if (SpeedSelectedOption === 'constantSpeed') {
    //     speed = 2; // Set your desired constant speed value
    // }
});
document.getElementById('shapeSelect').addEventListener('change', (e) => {
    selectedShape = e.target.value;
});

strokeWidthOption.addEventListener('change', () => {
    selectedWidthOption = strokeWidthOption.value;
    // if (selectedWidthOption === 'custom') {
    //      customWidth = customWidth.value;
    //     ctx.lineWidth = customWidth ;
    // } else {
    //     ctx.lineWidth = selectedWidthOption;
    // }
});
document.getElementById('applyStrokeWidth').addEventListener('click' , (e) =>{
//     if (selectedWidthOption === 'custom') {
//         customWidth = customWidth.value;
//        ctx.lineWidth = customWidth ;
//    }
})


