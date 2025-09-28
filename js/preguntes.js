export function loadQuestion(globalData, currentQuestionIndex, saveAnswer, updateMarcador) {
    const question = globalData.preguntes[currentQuestionIndex];
    const contenidorQuestionari = document.getElementById("questionari");

    const partida = JSON.parse(localStorage.getItem("partida")) || {};
    const respuestasGuardadas = partida.resposta || [];

    let stringDataQuestionari = `
        <h3>${question.pregunta}</h3>
        <img src='${question.imatge}' alt='Pregunta ${question.id}'>
        <ul>
    `;

    question.respostes.forEach((resposta, index) => {
        const isSelected = respuestasGuardadas.some(
            (r) => r.p === question.id && r.r === resposta.id
        );
        stringDataQuestionari += `
            <li>
                <button class="answer-button ${isSelected ? "selected" : ""}" data-index="${index}">
                    ${resposta.etiqueta}
                </button>
            </li>
        `;
    });

    stringDataQuestionari += `</ul>
        <div class="navigation-buttons">
            <button id="prevButton" style="display: ${currentQuestionIndex === 0 ? "none" : "inline-block"};">Anterior</button>
            <button id="nextButton" style="display: ${currentQuestionIndex === globalData.preguntes.length - 1 ? "none" : "inline-block"};">Siguiente</button>
        </div>
    `;
    contenidorQuestionari.innerHTML = stringDataQuestionari;

    const buttons = contenidorQuestionari.querySelectorAll(".answer-button");
    buttons.forEach((button, index) => {
        button.addEventListener("click", () => {
            console.log(`Respuesta seleccionada: ${question.respostes[index].etiqueta}`);
            const partida = JSON.parse(localStorage.getItem("partida")) || { resposta: [] };
            partida.resposta = partida.resposta.filter((r) => r.p !== question.id);
            partida.resposta.push({ p: question.id, r: question.respostes[index].id });
            localStorage.setItem("partida", JSON.stringify(partida));

            buttons.forEach((btn) => btn.classList.remove("selected"));
            button.classList.add("selected");
            console.log(JSON.parse(localStorage.getItem ("partida")).resposta);
        });
    });

    document.getElementById("prevButton").addEventListener("click", () => {
        if (currentQuestionIndex > 0) {
            loadQuestion(globalData, currentQuestionIndex - 1, saveAnswer, updateMarcador);
        }
    });

    document.getElementById("nextButton").addEventListener("click", () => {
        if (currentQuestionIndex < globalData.preguntes.length - 1) {
            loadQuestion(globalData, currentQuestionIndex + 1, saveAnswer, updateMarcador);
        }
    });

    updateMarcador();
}