/// Funció per mostrar la pantalla d'inici
export function showStartScreen(startQuiz) {
    const inici = document.getElementById("inici");
    inici.innerHTML = `
        <h1>Benvingut al qüestionari</h1>
        <center><button onclick="startQuiz()">Començar</button></center>
    `;
    document.getElementById("marcador").innerHTML = "";
    document.getElementById("questionari").innerHTML = "";
    document.getElementById("final").innerHTML = "";

    // Comprova si hi ha una partida guardada, si és així, carrega la partida anterior
    const partida = JSON.parse(localStorage.getItem("partida"));
    if (partida && partida.currentQuestionIndex !== undefined && partida.resposta.length > 0) {
        startQuiz(partida.currentQuestionIndex);
    }
    else {
        localStorage.removeItem("preguntes");
    }
}