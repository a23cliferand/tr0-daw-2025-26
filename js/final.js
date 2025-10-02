let URL = "http://localhost:8080";

function showEndScreen(correccio, globalData) {
    const partida = JSON.parse(localStorage.getItem("partida"));
    const respostesUsuari = partida?.resposta || [];

    document.getElementById("questionari").innerHTML = "";
    document.getElementById("marcador").innerHTML = "";

    // Muestra resumen final
    const final = document.getElementById("final");
    final.innerHTML = `
        <h1>Has completat el qüestionari!</h1>
        <h2>Has encertat ${correccio.respostesCorrectes} de ${correccio.totalPreguntes} preguntes.</h2>
        <div id="correccio-container"></div>
        <center><button onclick="reload()">Tornar a començar</button></center>
    `;

    const correccioContainer = document.getElementById("correccio-container");

    globalData.preguntes.forEach((pregunta) => {
        const respostaBackend = correccio.detallRespostesCorrectes.find(
            (resposta) => Number(resposta.id) === Number(pregunta.id)
        );

        const respostaUsuari = respostesUsuari.find(
            (resposta) => Number(resposta.p) === Number(pregunta.id)
        );

        const r = respostaUsuari ? respostaUsuari.r : 0;

        const preguntaDiv = document.createElement("div");
        preguntaDiv.classList.add("pregunta");

        preguntaDiv.innerHTML = `
            <h3>${pregunta.pregunta}</h3>
            <img src="img/${pregunta.imatge}" alt="Pregunta ${pregunta.id}" />
            <ul>
                ${pregunta.respostes
                    .map((resposta) => {
                        const isCorrect = respostaBackend && resposta.id === respostaBackend.correcta;
                        const isUserAnswer = resposta.id === r;

                        // console.log("INFO",resposta.etiqueta, isCorrect, isUserAnswer);

                        return `
                            <li>
                                <button class="answer-button ${
                                    isCorrect ? "correct" : isUserAnswer ? "incorrect" : ""
                                }">
                                    ${resposta.etiqueta}
                                </button>
                            </li>
                        `;
                    })
                    .join("")}
            </ul>
        `;

        correccioContainer.appendChild(preguntaDiv);
    });
}

async function finalCheck(globalData) {
    const partida = JSON.parse(localStorage.getItem("partida"));
    const respostes = partida.resposta;
    console.log("Respostes enviades al backend:", respostes);

    for (let i = respostes.length; i < globalData.preguntes.length; i++) {
        respostes.push({ p: globalData.preguntes[i].id, r: 0 });
    }

    try {
        const response = await fetch(`${URL}/back/back.php?action=correccio`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(respostes),
        });

        const correccio = await response.json();
        console.log(correccio);
        return correccio;
    } catch (error) {
        console.error("Error:", error);
        return null;
    }
}

function reload() {
    localStorage.removeItem("partida");
    localStorage.removeItem("preguntes");
    location.reload();
}

window.reload = reload;

export async function finalGame(globalData) {
    const correccio = await finalCheck(globalData);
    showEndScreen(correccio, globalData);
    localStorage.removeItem("partida");
    localStorage.removeItem("preguntes");
}