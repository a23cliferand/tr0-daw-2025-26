import { showAll } from "./principal.js";

let URL = "http://localhost:8080";

export function showEditarForm(data, onSubmit, principalList) {
    const editarContainer = document.getElementById("editar");
    editarContainer.innerHTML = `
        <h2>Editar Pregunta</h2>
        <form id="editarForm">
            <input type="hidden" id="id" name="id" value="${data.id || ''}">
            
            <label for="pregunta">Pregunta:</label>
            <input type="text" id="pregunta" name="pregunta" value="${data.pregunta || ''}" required>
            
            <label>Respostes:</label>
            <div class="respostes-container">
                <label for="resposta1">Resposta 1:</label>
                <input type="text" id="resposta1" name="resposta1" value="${data.respostes && data.respostes[0].etiqueta ? data.respostes[0].etiqueta : ''}" required>
                
                <label for="resposta2">Resposta 2:</label>
                <input type="text" id="resposta2" name="resposta2" value="${data.respostes && data.respostes[1].etiqueta ? data.respostes[1].etiqueta : ''}" required>
                
                <label for="resposta3">Resposta 3:</label>
                <input type="text" id="resposta3" name="resposta3" value="${data.respostes && data.respostes[2].etiqueta ? data.respostes[2].etiqueta : ''}" required>
                
                <label for="resposta4">Resposta 4:</label>
                <input type="text" id="resposta4" name="resposta4" value="${data.respostes && data.respostes[3].etiqueta ? data.respostes[3].etiqueta : ''}" required>
            </div>
            
            <label for="resposta_correcta">Resposta Correcta (1-4):</label>
            <select id="resposta_correcta" name="resposta_correcta" required>
                <option value="1" ${data.resposta_correcta == 1 ? "selected" : ""}>1</option>
                <option value="2" ${data.resposta_correcta == 2 ? "selected" : ""}>2</option>
                <option value="3" ${data.resposta_correcta == 3 ? "selected" : ""}>3</option>
                <option value="4" ${data.resposta_correcta == 4 ? "selected" : ""}>4</option>
            </select>
            
            <label for="imatge">Imatge</label><br>
            <img src="${URL}/img/${data.imatge}" alt="Imatge actual" style="max-width: 200px; display: 'block' : 'none'}; margin-bottom: 10px;">
            <input type="file" id="imatge" name="imatge">
            <center>
            <button type="submit">Guardar Cambios</button>
            <button type="button" id="cancelarEdicion">Cancelar</button>
            </center>
        </form>
    `;

    const form = document.getElementById("editarForm");
    const cancelButton = document.getElementById("cancelarEdicion");

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        try {

            if (!form.pregunta.id || !form.resposta1.value.trim() || !form.resposta2.value.trim() || !form.resposta3.value.trim() || !form.resposta4.value.trim()) {
                alert("Por favor, completa todos los campos correctamente");
                return;
            }

            if(isNaN(form.resposta_correcta.value) || form.resposta_correcta.value < 1 || form.resposta_correcta.value > 4) {
                alert("La respuesta correcta debe ser un número entre 1 y 4");
                return;
            }

            const respostes = [
                { id:1, etiqueta: form.resposta1.value.trim() },
                { id:2, etiqueta: form.resposta2.value.trim() },
                { id:3, etiqueta: form.resposta3.value.trim() },
                { id:4, etiqueta: form.resposta4.value.trim() }
            ];

            const updatedData = {
                id: parseInt(form.id.value),
                pregunta: form.pregunta.value.trim(),
                respostes: respostes,
                resposta_correcta: parseInt(form.resposta_correcta.value),
                imatge: form.imatge.files[0]
            };

            onSubmit(updatedData);
            showAll();
            editarContainer.style.display = "none";
            editarContainer.innerHTML = "";
        } catch (error) {
            alert("Error al procesar los datos. Por favor, verifica que todos los campos estén completos.");
            console.error("Error al enviar los datos:", error);
        }
    });

    cancelButton.addEventListener("click", () => {
        showAll();
        editarContainer.style.display = "none";
        editarContainer.innerHTML = "";
    });

    editarContainer.style.display = "block";
}