import { showAll } from "./principal.js";

export function showCrearForm(onSubmit) {
    const crearContainer = document.getElementById("crear");
    crearContainer.innerHTML = `
        <h2>Crear Pregunta</h2>
        <form id="crearForm">
            <ul style="list-style: none; padding: 0;">
                <li>
                    <label for="pregunta">Pregunta:</label><br>
                    <input type="text" id="pregunta" name="pregunta" required>
                </li>
                <li>
                    <label>Respostes:</label>
                    <ul style="list-style: none; padding-left: 1em;">
                        <li>
                            <label for="resposta1">Resposta 1:</label><br>
                            <input type="text" id="resposta1" name="resposta1" required>
                        </li>
                        <li>
                            <label for="resposta2">Resposta 2:</label><br>
                            <input type="text" id="resposta2" name="resposta2" required>
                        </li>
                        <li>
                            <label for="resposta3">Resposta 3:</label><br>
                            <input type="text" id="resposta3" name="resposta3" required>
                        </li>
                        <li>
                            <label for="resposta4">Resposta 4:</label><br>
                            <input type="text" id="resposta4" name="resposta4" required>
                        </li>
                    </ul>
                </li>
                <li>
                    <label for="resposta_correcta">Resposta Correcta (1-4):</label><br>
                    <select id="resposta_correcta" name="resposta_correcta" required>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                    </select>
                </li>
                <li>
                    <label for="imatge">Imatge (URL):</label><br>
                    <input type="text" id="imatge" name="imatge" required>
                </li>
                <li style="margin-top: 1em;">
                    <button type="submit">Crear</button>
                    <button type="button" id="cancelarCrear">Cancelar</button>
                </li>
            </ul>
        </form>
    `;

    const form = document.getElementById("crearForm");
    const cancelButton = document.getElementById("cancelarCrear");


    form.addEventListener("submit", (e) => {
        e.preventDefault();
        try {

            if (!form.pregunta.id || !form.resposta1.value.trim() || !form.resposta2.value.trim() || !form.resposta3.value.trim() || !form.resposta4.value.trim() || !form.imatge.value.trim()) {
                alert("Por favor, completa todos los campos correctamente");
                return;
            }

            if(isNaN(form.resposta_correcta.value) || form.resposta_correcta.value < 1 || form.resposta_correcta.value > 4) {
                alert("La respuesta correcta debe ser un número entre 1 y 4");
                return;
            }

            const respostes = [
            { id: 1, etiqueta: form.resposta1.value.trim() },
            { id: 2, etiqueta: form.resposta2.value.trim() },
            { id: 3, etiqueta: form.resposta3.value.trim() },
            { id: 4, etiqueta: form.resposta4.value.trim() }
            ];

            const updatedData = {
            pregunta: form.pregunta.value.trim(),
            respostes: respostes,
            resposta_correcta: parseInt(form.resposta_correcta.value),
            imatge: form.imatge.value.trim(),
            };

            onSubmit(updatedData);
        } catch (error) {
            console.error("Error al procesar el formulario:", error);
            alert("Ocurrió un error al procesar el formulario. Por favor, inténtalo de nuevo.");
        }

        crearContainer.innerHTML = "";
        showAll();
    });

    cancelButton.addEventListener("click", () => {
        crearContainer.style.display = "none";
        crearContainer.innerHTML = "";
        showAll();
    });

    crearContainer.style.display = "block";
}