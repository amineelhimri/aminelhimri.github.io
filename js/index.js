/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, remove, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = {
    databaseURL: "https://ultimate-7afdd-default-rtdb.europe-west1.firebasedatabase.app/"
}

const app = initializeApp(appSettings);
const database = getDatabase(app);
const MTimeinDb = ref(database, "MatchTime/1");
const STimeinDb = ref(database, "ShotTime/1");


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
    IR = true;
    
}

player1.textContent = player1Value;
player2.textContent = player2Value;
MTime.textContent = matchTimeValue;
set(MTimeinDb , matchTimeValue);
STime.textContent = shotTimeValue;
set(STimeinDb , shotTimeValue);
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
var MatchStarted = false;
var t3 = 0;
var t4 = 0;
var IR = false;
var MatchTimePaused = true;
var ShotTimeLeft = parseInt(shotTimeValue); 
var interval;
var interval1;
var interval2;
var phaseF = false;
var shotRuning = false;
var shotPaused = false;
var Timeout = false;


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

    if(matchTimeLeft == 0){
        MTime.style = "color: var(--couleur-timer-2);";
        clearInterval(interval1);
        MatchStarted = null;
        stoppy();
        r.style.setProperty('--border-chrono-1','#FF000090');
        STime.textContent = "0"; 
        set(STimeinDb , "0");
        alerTime();
        TimeIsUp.play();
        MTime.textContent = time;
        set(MTimeinDb , time);
    }
    else{
        MTime.textContent = time;
        set(MTimeinDb , time);
    }

    if(matchTimeLeft <= (1000 * 60 * 10) && matchTimeLeft > 0){
        phaseF = true;
        MTime.style = "color: var(--couleur-timer-1);";
    }
}

function startMatch(){
    interval1 = setInterval(displayMatchTime, 1000);
}

cont.addEventListener("click", function() {
    if(MatchStarted && MatchTimePaused && !shotPaused){
        startMatch();
        MatchTimePaused = false
        stoppy();
        startShot();
        start.innerHTML = "Reset";
    }
})

const pause = document.getElementById('Pause');

pause.addEventListener("click", function() {
    if(MatchStarted && !MatchTimePaused){
        if(shotRuning){
            start.innerHTML = "Start";
            shotRuning = false;
        }
        clearInterval(interval1);
        clearInterval(interval);
        stoppy();
        MatchTimePaused = true;
        if(shotRuning){
            start.innerHTML = "Start";
            shotRuning = false;
        }
        
    }
})


const start = document.getElementById('start');


function displayShotTime(){
    chronoBorder1(ShotTimeLeft % 2);
    ShotTimeLeft--;
    if(ShotTimeLeft == 0){
        TimeIsUp.play();
        clearInterval(interval);
        Timeout = true;
        STime.textContent = ShotTimeLeft;
        set(STimeinDb , "0");
        return;
    }
    if(ShotTimeLeft == 15){
        ShotTimeAudioAlert.play();
    }

    if(ShotTimeLeft <= 5 && ShotTimeLeft > 0){
        TimeClose.load();
        r.style.setProperty('--border-chrono-1','#FF000090');
        alerTime();
        TimeClose.play();
    }
    else{
        STime.style = "color: var(--couleur-timer);";
        r.style.setProperty('--border-chrono-1','#00FF7F');
    }
    STime.textContent = ShotTimeLeft;
    set(STimeinDb , ShotTimeLeft);
}

function startShot(){
    if(ShotTimeLeft == parseInt(shotTimeValue) && !MatchTimePaused){
        interval = setInterval(displayShotTime, 1000);
        shotRuning = true;
    }
}

start.addEventListener("click", function() {
    if(MatchStarted && !shotPaused){
        if(!shotRuning){
            start.innerHTML = "Reset";
            startShot();
        }
        else{
            start.innerHTML = "Start";
            stoppy();
            Timeout = false;
        }
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
    set(STimeinDb , ShotTimeLeft);
    clearInterval(interval);
    shotRuning = false;
}
stopp.addEventListener("click", function() {
    if(shotRuning && !Timeout){
        if(!shotPaused){
            stopp.innerHTML = "Resum"
            clearInterval(interval);
            clearInterval(interval1);
            MatchTimePaused = true;
            shotPaused = true;
        }
        else{
            stopp.innerHTML = "Pause"
            displayShotTime();
            displayMatchTime();
            interval = setInterval(displayShotTime, 1000);
            interval1 = setInterval(displayMatchTime, 1000);
            shotPaused = false;
            MatchTimePaused = false;
        }
    }
})

const startAll = document.getElementById("startAll");

startAll.addEventListener("click", function() {
    if(!MatchStarted){
        start.innerHTML = "Reset";
        MatchStarted = true;
        MatchTimePaused = false;
        startShot();
        calcuMatchTime();
        if(!IR){
            startMatch();
        }
    }
})

const reset = document.getElementById('reset');

reset.addEventListener("click", function() {
    window.location.href = "index.html";
})


