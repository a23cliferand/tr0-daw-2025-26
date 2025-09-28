import { showCrearForm } from "./crear.js";

const principalContainer = document.getElementById("llista");
const crearContainer = document.getElementById("crear");
const editarContainer = document.getElementById("editar");

export function showPrincipalList(data, onEdit, onDelete, onCreate) {
    principalContainer.innerHTML = `
        <h2>Llista de Preguntes</h2>
        <button class="create-button">Crear Nueva Pregunta</button>
        <ul>
            ${data
                .map(
                    (item) => `
                <li>
                    ${item.pregunta}
                    <ul>
                        ${item.respostes
                            .map(
                                (resposta) => `
                                <li>${resposta.id == item.resposta_correcta ? `<strong>${resposta.etiqueta}</strong>` : resposta.etiqueta}</li>
                            `
                            )
                            .join("")}
                    </ul>
                    <button class="edit-button" data-id="${item.id}">Editar</button>
                    <button class="delete-button" data-id="${item.id}">Eliminar</button>
                </li>
            `
                )
                .join("")}
        </ul>
    `;

    const crearButton = principalContainer.querySelectorAll(".create-button");
    crearButton.forEach((button) => {
        button.addEventListener("click", () => {
            principalContainer.style.display = "none";
            showCrearForm(onCreate);
        });
    });

    const editButtons = principalContainer.querySelectorAll(".edit-button");
    editButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            const item = data.find((q) => parseInt(q.id) === id);
            // principalContainer.innerHTML = "";
            principalContainer.style.display = "none";
            //onEdit(item);
        });
    });

    const deleteButtons = principalContainer.querySelectorAll(".delete-button");
    deleteButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const id = parseInt(button.getAttribute("data-id"));
            if (confirm("¿Estás seguro de que deseas eliminar esta pregunta?")) {
            onDelete(id);
            }
        });
    });
}

export function showAll() {
    principalContainer.style.display = "block";
    crearContainer.style.display = "none";
    editarContainer.style.display = "none";
}