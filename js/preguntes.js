import { finalGame } from "./final.js";
import { stopTimer } from "./script.js";

let URL = "http://localhost:8080";

export function loadQuestion(
  globalData,
  currentQuestionIndex,
  saveAnswer,
  updateMarcador
) {
  const question = globalData.preguntes[currentQuestionIndex];
  const contenidorQuestionari = document.getElementById("questionari");

  const partida = JSON.parse(localStorage.getItem("partida")) || {};
  partida.currentQuestionIndex = currentQuestionIndex;
  localStorage.setItem("partida", JSON.stringify(partida));
  const respuestasGuardadas = partida.resposta || [];

  // Crea una cadena per la pregunta
  let stringDataQuestionari = `
        <h3>${question.pregunta}</h3>
        <center><img src='${URL}/img/${question.imatge}' alt='Pregunta ${question.id}'></center>
        <ul>
    `;

  // Afegir les respostes com a botons
  question.respostes.forEach((resposta, index) => {
    const isSelected = respuestasGuardadas.some(
      (r) => r.p === question.id && r.r === resposta.id
    );
    stringDataQuestionari += `
            <li>
                <button class="answer-button ${
                  isSelected ? "selected" : ""
                }" data-index="${index}">
                    ${resposta.etiqueta}
                </button>
            </li>
        `;
  });

  // Afegir botons de navegació
  stringDataQuestionari += `</ul>
        <div class="navigation-buttons" style="display: flex; justify-content: space-between; align-items: center;">
            <button id="prevButton" style="visibility: ${
              currentQuestionIndex === 0 ? "hidden" : "visible"
            }; min-width: 100px;">Anterior</button>
            <div style="display: flex; gap: 10px;">
                <button id="nextButton" style="display: ${
                  currentQuestionIndex === globalData.preguntes.length - 1
                    ? "none"
                    : "inline-block"
                }; min-width: 100px;">Següent</button>
                <button id="finalizarButton" style="display: ${
                  currentQuestionIndex === globalData.preguntes.length - 1
                    ? "inline-block"
                    : "none"
                }; min-width: 100px;">Finalitzar</button>
            </div>
        </div>
    `;
  contenidorQuestionari.innerHTML = stringDataQuestionari;

  // Afegir esdevenidors als botons de resposta
  const buttons = contenidorQuestionari.querySelectorAll(".answer-button");
  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      // console.log(`Respuesta seleccionada: ${question.respostes[index].etiqueta}`);
      const partida = JSON.parse(localStorage.getItem("partida")) || {
        resposta: [],
      };
      partida.resposta = partida.resposta.filter((r) => r.p !== question.id);
      partida.resposta.push({
        p: question.id,
        r: question.respostes[index].id,
      });
      localStorage.setItem("partida", JSON.stringify(partida));

      buttons.forEach((btn) => btn.classList.remove("selected"));
      button.classList.add("selected");
      // console.log(JSON.parse(localStorage.getItem("partida")).resposta);
    });
  });

  document.getElementById("prevButton").addEventListener("click", () => {
    if (currentQuestionIndex > 0) {
      loadQuestion(
        globalData,
        currentQuestionIndex - 1,
        saveAnswer,
        updateMarcador
      );
    }
  });

  document.getElementById("nextButton").addEventListener("click", () => {
    if (currentQuestionIndex < globalData.preguntes.length - 1) {
      loadQuestion(
        globalData,
        currentQuestionIndex + 1,
        saveAnswer,
        updateMarcador
      );
    }
  });

  document.getElementById("finalizarButton").addEventListener("click", () => {
    stopTimer();
    finalGame(globalData);
  });

  updateMarcador();
}