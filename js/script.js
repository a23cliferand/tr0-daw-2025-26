import { showStartScreen } from "./inici.js";
import { loadQuestion } from "./preguntes.js";
import { finalGame } from "./final.js";


// global Data = Preguntes
// estatDeLaPartida = {resposta: Respostes de l'usuari, temps: Temps de la partida}
// currentQuestionIndex = Índex de la pregunta actual
// timerInterval = Interval del temporitzador

let globalData;
let estatDeLaPartida = { resposta: [], temps: 30 };
let currentQuestionIndex = 0;
let timerInterval;

let URL = "http://a23cliferand.daw.inspedralbes.cat/tr0";

// Recupera l'estat de la partida desat al localStorage
function getPartidaFromStorage() {
  const partida = localStorage.getItem("partida");
  return partida ? JSON.parse(partida) : estatDeLaPartida;
}

// Desa l'estat de la partida al localStorage
function savePartidaToStorage(partida) {
  localStorage.setItem("partida", JSON.stringify(partida));
}

// Iniciar el qüestionari
function startQuiz() {
  const partida = localStorage.getItem("partida");
  if (partida) {
    const parsedPartida = JSON.parse(partida);
    if (parsedPartida.resposta && parsedPartida.resposta.length > 0) {
      estatDeLaPartida = parsedPartida;
    } else {
      savePartidaToStorage(estatDeLaPartida);
    }
  } else {
    savePartidaToStorage(estatDeLaPartida);
  }

  startTimer();

  estatDeLaPartida = getPartidaFromStorage();

  document.getElementById("inici").innerHTML = "";

  updateMarcador();

  loadQuestion(globalData, currentQuestionIndex, saveAnswer, updateMarcador);
}

function crudOperations() {
  window.location.href = "./crud.html";
}

window.crudOperations = crudOperations;

// Desa la resposta de l'usuari i carrega la següent pregunta o finalitza el qüestionari
function saveAnswer(i, j) {
  const question = globalData.preguntes[i];

  estatDeLaPartida = getPartidaFromStorage();

  estatDeLaPartida.resposta.push({
    p: question.id,
    r: question.respostes[j].id,
  });

  savePartidaToStorage(estatDeLaPartida);

  if (currentQuestionIndex < globalData.preguntes.length - 1) {
    currentQuestionIndex++;
    loadQuestion(globalData, currentQuestionIndex, saveAnswer, updateMarcador);
  } else {
    stopTimer();
    finalGame();
  }
}

// Mostra la correcció final amb les respostes correctes i les respostes de l'usuari
function updateMarcador() {
  const partida = getPartidaFromStorage();
  const contenidorMarcador = document.getElementById("marcador");
  contenidorMarcador.innerHTML = `
        <div class="progress box">
            <div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style="width: ${
              (partida.resposta.length / globalData.preguntes.length) * 100
            }%;" aria-valuenow="${
    partida.resposta.length
  }" aria-valuemin="0" aria-valuemax="${
    globalData.preguntes.length
  }">${Math.round(
    (partida.resposta.length / globalData.preguntes.length) * 100
  )}%</div>
        </div>
        <br>
        <p>Has contestat ${partida.resposta.length} de ${
    globalData.preguntes.length
  } preguntes</p>
        <p>Temps restant: ${partida.temps}s</p>
        <button onclick="resetPartida()">Esborrar Partida</button>
    `;
}

// Inicia el temporitzador
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

export function resetPartida() {
  localStorage.removeItem("partida");
  localStorage.removeItem("preguntes");
  globalData = null;
  estatDeLaPartida = { resposta: [], temps: 30 };
  currentQuestionIndex = 0;
  location.reload();
}

window.resetPartida = resetPartida;

// Atura el temporitzador
export function stopTimer() {
  clearInterval(timerInterval);
}

// Carrega les preguntes i mostra la pantalla d'inici al principi
window.addEventListener("DOMContentLoaded", (event) => {
  const partidaGuardada = localStorage.getItem("partida");
  const savedQuestions = localStorage.getItem("preguntes");

  if (partidaGuardada && savedQuestions) {
    globalData = JSON.parse(savedQuestions);
    estatDeLaPartida = getPartidaFromStorage();
    currentQuestionIndex = estatDeLaPartida.resposta.length;
    showStartScreen(startQuiz);
  } else {
    fetch(`${URL}/back/back.php?action=getData&quantitat=10`)
      .then((response) => response.json())
      .then((data) => {
        globalData = data;
        localStorage.setItem("preguntes", JSON.stringify(globalData));
        showStartScreen(startQuiz);
      });
  }
});

window.startQuiz = startQuiz;