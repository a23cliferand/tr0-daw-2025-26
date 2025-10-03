// Funció per mostrar la pantalla de càrrega
export function showCarrega(time) {
    const carregaDiv = document.createElement('div');
    carregaDiv.id = 'carrega';
    carregaDiv.innerHTML = `
        <div class="carrega-intern">
            <div class="carrega-spinner"></div>
            <p>Carregant...</p>
        </div>
    `;
    document.body.appendChild(carregaDiv);

    setTimeout(() => {
        carregaDiv.remove();
    }, time);
}