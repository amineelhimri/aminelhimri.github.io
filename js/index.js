const player1 = document.getElementById('p1');
const player2 = document.getElementById('p2');
const MTime = document.getElementById('MTime');
const STime = document.getElementById('STime');
const ETime1 = document.getElementById('ETime1');
const ETime2 = document.getElementById('ETime2');
const race = document.getElementById('raceTo');

const player1Value = localStorage.getItem('P_1');
const player2Value = localStorage.getItem('P_2');
const matchTimeValue = localStorage.getItem('M_Time');
var shotTimeValue = localStorage.getItem('S_Time');
var ExtensionTime = parseInt(localStorage.getItem('E_Time'));
const raceValue = parseInt(localStorage.getItem('raceTo'));
const rules = localStorage.getItem('Format');


if(rules === "Shotout"){
    document.getElementById("Time").style = "display: none;";
    t5 = 1;
    
}

player1.textContent = player1Value;
player2.textContent = player2Value;
MTime.textContent = matchTimeValue;
STime.textContent = shotTimeValue;
race.textContent = `Race To ${raceValue}`;


if(player1Value === ""){
    player1.textContent = "Player 1";
}

if(player2Value === ""){
    player2.textContent = "Player 2";
}


const score1 = document.getElementById('score1');
const score2 = document.getElementById('score2');
const plus1 = document.getElementById('plus1');
const plus2 = document.getElementById('plus2');
const minus1 = document.getElementById('minus1');
const minus2 = document.getElementById('minus2');
const borderChrono = document.getElementById('borderChrono');
const ExtensionAudio = new Audio("./audio/extension.mp3");
const ShotTimeAudioAlert = new Audio('./audio/shotTime.mp3');
const TimeClose = new Audio('./audio/TimeClose.mp3');
const TimeIsUp = new Audio('./audio/TimeIsUp.mp3');
const r = document.querySelector(':root');

var matchTimeLeft;
var t1 = 0;
var t2 = 0;
var t3 = 0;
var t4 = 0;
var MatchTimePaused = true;
var ShotTimeLeft = parseInt(shotTimeValue); 
var interval;
var interval1;
var interval2;
var phaseF = false;
var shotRuning = false;



function alerTime(){
    STime.style = "animation-name: flash;"
}

function chronoBorder1(t){
    if(t == 1){
        borderChrono.style = "border-color: var(--border-chrono-1) var(--border-chrono-2) var(--border-chrono-1) var(--border-chrono-2);"
    }
    else{
        borderChrono.style = "border-color: var(--border-chrono-2) var(--border-chrono-1) var(--border-chrono-2) var(--border-chrono-1);"
    }
}

function playSound(AudioName){
    let audio = new Audio(AudioName);
    audio.play();
}

function ExtensionNoneAvailable(exten) {
    exten.style = "background-color: var(--white); color: var(--score-board);";
}

function ExtensionAvailable(exten) {
    exten.style = "background-color: var(--score-board); color: var(--couleur-text);";
}

ETime1.addEventListener("click", function() {
    if(t3 == 0 && ShotTimeLeft >= 0 && shotRuning){
        ExtensionAudio.play();
        ExtensionNoneAvailable(ETime1);
        t3 = 1;
        ShotTimeLeft += ExtensionTime;
    }
})

ETime2.addEventListener("click", function() {
    if(t4 == 0 && ShotTimeLeft >= 0 && shotRuning){
        ExtensionAudio.play();
        ExtensionNoneAvailable(ETime2);
        t4 = 1;
        ShotTimeLeft += ExtensionTime;
    }
}) 

function calcuMatchTime(){
    if(matchTimeValue.length == 5){
        let regExTime = /([0-9][0-9]):([0-9][0-9])/;
        let regExTimeArr = regExTime.exec(matchTimeValue);
        matchTimeLeft = parseInt(regExTimeArr[1]) * 60 * 1000;
    }
    else{
        let regExTime = /([0-9][0-9]):([0-9][0-9]):([0-9][0-9])/;
        let regExTimeArr = regExTime.exec(matchTimeValue);
        matchTimeLeft = parseInt(regExTimeArr[1]) * 60 * 60 * 1000 + parseInt(regExTimeArr[2]) * 60 * 1000;
    }
}

function addScore(action) {
    var score = parseInt(action.innerHTML);
    score++;
    action.innerHTML = score;
}

function minusScore(action) {
    var score = parseInt(action.innerHTML);
    if(score > 0){
        score--;
        action.innerHTML = score;
    }
}
plus1.addEventListener("click", function() {
    let stat = parseInt(score1.innerHTML);
    if(MatchTimePaused && stat < raceValue){
        addScore(score1);
        ExtensionAvailable(ETime1);
        ExtensionAvailable(ETime2);
        t4 = 0; t3 = 0;
    }
});

plus2.addEventListener("click", function() {
    let stat = parseInt(score2.innerHTML);
    if(MatchTimePaused && stat < raceValue){
        addScore(score2);
        ExtensionAvailable(ETime1);
        ExtensionAvailable(ETime2);
        t4 = 0; t3 = 0;
    }
});

minus1.addEventListener("click", function() {
    if(MatchTimePaused){
        minusScore(score1);
    }
});

minus2.addEventListener("click", function() {
    if(MatchTimePaused){
        minusScore(score2);
    }
});


const cont = document.getElementById('continue');

function displayMatchTime(){
    matchTimeLeft -= 1000;
    let time;
    let hrs = Math.floor(matchTimeLeft / (1000 * 60 * 60));
    let min = Math.floor((matchTimeLeft % (1000 * 60 * 60)) / (1000 * 60));
    let sec = Math.floor((matchTimeLeft % (1000 * 60)) / 1000);
    let Shrs = hrs.toString().padStart(2, '0');
    let Smin = min.toString().padStart(2, '0');
    let Ssec = sec.toString().padStart(2, '0');

    if(hrs == 0){
        time = `${Smin}:${Ssec}`;
    }
    else{
        time = `${Shrs}:${Smin}:${Ssec}`;
    }

    if(matchTimeLeft == -1000){
        MTime.style = "color: var(--couleur-timer-2);";
        clearInterval(interval1);
        t1 = 2;
        stoppy();
        r.style.setProperty('--border-chrono-1','#FF000090');
        STime.textContent = "0"; 
        alerTime();
        TimeIsUp.play();
    }
    else{
        MTime.textContent = time;
    }

    if(matchTimeLeft <= (1000 * 60 * 10) && matchTimeLeft > 0){
        phaseF = true;
        MTime.style = "color: var(--couleur-timer-1);";
    }
}

function startMatch(){
    displayMatchTime();
    interval1 = setInterval(displayMatchTime, 1000);
}

cont.addEventListener("click", function() {
    if(t1 == 1 && t2 == 1){
        startMatch();
        stoppy();
        t2 = 0;
        startShot();
        MatchTimePaused = false;
    }
})

const pause = document.getElementById('Pause');

pause.addEventListener("click", function() {
    if(t1 == 1){
        clearInterval(interval1);
        clearInterval(interval);
        stoppy();
        t2 = 1;
        MatchTimePaused = true;
        if(phaseF){
            shotTimeValue = 15;
            ExtensionTime = 10;
        }
    }
})


const start = document.getElementById('start');


function displayShotTime(){
    chronoBorder1(ShotTimeLeft % 2);
    ShotTimeLeft--;
    if(ShotTimeLeft == -1){
        TimeIsUp.play();
        clearInterval(interval);
        return;
    }
    if(ShotTimeLeft == 15){
        ShotTimeAudioAlert.play();
    }

    if(ShotTimeLeft <= 5 && ShotTimeLeft >= 0){
        r.style.setProperty('--border-chrono-1','#FF000090');
        alerTime();
        TimeClose.play();
    }
    else{
        STime.style = "color: var(--couleur-timer);";
        r.style.setProperty('--border-chrono-1','#00FF7F');
    }
    STime.textContent = ShotTimeLeft;
}

function startShot(){
    if(ShotTimeLeft == parseInt(shotTimeValue) && t2 == 0){
        displayShotTime();
        interval = setInterval(displayShotTime, 1000);
        shotRuning = true;
    }
}

start.addEventListener("click", function() {
    if(t1 == 1){
        startShot();
    }
})

const stopp = document.getElementById('stop');

function stoppy() {
    STime.style = "color: var(--couleur-timer);"
    r.style.setProperty('--border-chrono-1','#00FF7F');
    if(phaseF){
        shotTimeValue = 15;
        ExtensionTime = 10;
    }
    ShotTimeLeft = parseInt(shotTimeValue);
    STime.textContent = ShotTimeLeft;
    clearInterval(interval);
    shotRuning = false;
}
stopp.addEventListener("click", function() {
    if(t1 == 1){
        stoppy();
    }
})

const startAll = document.getElementById("startAll");

startAll.addEventListener("click", function() {
    if(t1 == 0){
        t1 = 1;
        startShot();
        calcuMatchTime();
        if(t5 == 0){
            MatchTimePaused = false;
            startMatch();
        }
    }
})

const reset = document.getElementById('reset');

reset.addEventListener("click", function() {
    window.location.href = "index.html";
})

