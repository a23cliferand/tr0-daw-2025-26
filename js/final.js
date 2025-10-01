let URL = "http://a23cliferand.daw.inspedralbes.cat/tr0";

function showEndScreen(correccio) {
    document.getElementById("questionari").innerHTML = "";
    document.getElementById("marcador").innerHTML = "";

    const final = document.getElementById("final");
    final.innerHTML = `
        <h1>Has completat el qüestionari!</h1>
        <h2>Has encertat ${correccio.respostesCorrectes} de ${correccio.totalPreguntes} preguntes.</h2>
        <button onclick="reload()">Tornar a començar</button>
    `;
}

async function finalCheck(globalData) {
    const partida = JSON.parse(localStorage.getItem("partida"));
    const respostes = partida.resposta;
    console.log(respostes);

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
    console.log("Reloading the quiz...");
    localStorage.removeItem("partida");
    localStorage.removeItem("preguntes");
    location.reload();
}

window.reload = reload;

export async function finalGame(globalData) {
    const correccio = await finalCheck(globalData);
    console.log(correccio);
    showEndScreen(correccio);
}