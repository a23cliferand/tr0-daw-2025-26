function showEndScreen(correccio) {
    document.getElementById("questionari").innerHTML = "";
    document.getElementById("marcador").innerHTML = "";

    const final = document.getElementById("final");
    final.innerHTML = `
        <h1>Has completat el qüestionari!</h1>
        <h2>Has encertat ${correccio.respostesCorrectes} de ${correccio.totalPreguntes} preguntes.</h2>
        <button onclick="location.reload()">Tornar a començar</button>
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
        const response = await fetch("http://localhost:8080/back/back.php?action=correccio", {
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

export async function finalGame(globalData) {
    const correccio = await finalCheck(globalData);
    console.log(correccio);
    showEndScreen(correccio);
}