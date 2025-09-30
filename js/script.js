import { showStartScreen } from "./inici.js";
import { loadQuestion } from "./preguntes.js";
import { finalGame } from "./final.js";

console.log("Hola");

let globalData;
let estatDeLaPartida = { resposta: [], temps: 30 };
let currentQuestionIndex = 0;
let timerInterval;


function getPartidaFromStorage() {
    const partida = localStorage.getItem("partida");
    return partida ? JSON.parse(partida) : estatDeLaPartida;
}

function savePartidaToStorage(partida) {
    localStorage.setItem("partida", JSON.stringify(partida));
}



// Iniciar el qüestionari
function startQuiz() {
    savePartidaToStorage(estatDeLaPartida);

    startTimer();

    estatDeLaPartida = getPartidaFromStorage();
    
    document.getElementById("inici").innerHTML = "";

    updateMarcador();
    
    loadQuestion(globalData, currentQuestionIndex, saveAnswer, updateMarcador);
}

function saveAnswer(i, j) {
    const question = globalData.preguntes[i];
    
    estatDeLaPartida = getPartidaFromStorage();
    

    estatDeLaPartida.resposta.push({ p: question.id, r: question.respostes[j].id });
    
    savePartidaToStorage(estatDeLaPartida);

    if (currentQuestionIndex < globalData.preguntes.length - 1) {
        currentQuestionIndex++;
        loadQuestion(globalData, currentQuestionIndex, saveAnswer, updateMarcador);
    } else {
        stopTimer();
        finalGame();
    }
}

function updateMarcador() {
    const partida = getPartidaFromStorage();
    const contenidorMarcador = document.getElementById("marcador");
    contenidorMarcador.innerHTML = `
        <h3>Marcador</h3>
        <p>Has contestat ${partida.resposta.length} de ${globalData.preguntes.length} preguntes</p>
        <p>Temps restant: ${partida.temps}s</p>
    `; 
}

function startTimer() {
    timerInterval = setInterval(() => {
        estatDeLaPartida = getPartidaFromStorage();
        
        if (estatDeLaPartida.temps <= 0) {
            stopTimer();
            finalGame(globalData);
            return;
        }
        
        estatDeLaPartida.temps--;
        
        savePartidaToStorage(estatDeLaPartida);
        
        updateMarcador();
    }, 1000);
}

export function stopTimer() {
    clearInterval(timerInterval);
}

window.addEventListener("DOMContentLoaded", (event) => {
    fetch("http://localhost:8080/back/back.php?action=getData&quantitat=10")
        .then((response) => response.json())
        .then((data) => {
            globalData = data;
            showStartScreen(startQuiz);
        });
});

window.startQuiz = startQuiz;