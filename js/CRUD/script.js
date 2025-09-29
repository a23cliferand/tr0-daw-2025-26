import { showPrincipalList } from "./principal.js";
import { showCrearForm } from "./crear.js";
import { showEditarForm } from "./editar.js";

let data = [];

function fetchData() {
    fetch("http://localhost:8080/back/back.php?action=getData&quantitat=all")
        .then((response) => response.json())
        .then((result) => {
            data = result.preguntes;
            showPrincipalList(data, handleEdit, handleDelete, handleCreate);
        });
}

function handleCreate(newData) {
    console.log("Creating new data:", newData);
    const formData = new FormData();

    formData.append("pregunta", newData.pregunta);
    formData.append("respostes", JSON.stringify(newData.respostes));
    formData.append("resposta_correcta", newData.resposta_correcta);

    if (newData.imatge instanceof File) {
        formData.append("imatge", newData.imatge);
    }

    fetch("http://localhost:8080/back/back.php?action=crearPregunta", {
        method: "POST",
        body: formData,
    }).then(() => fetchData());
}


function handleEdit(updatedData) {
    console.log("Editing data:", updatedData);
    const formData = new FormData();

    formData.append("id", updatedData.id);
    formData.append("pregunta", updatedData.pregunta);
    formData.append("respostes", JSON.stringify(updatedData.respostes));
    formData.append("resposta_correcta", updatedData.resposta_correcta);

    if (updatedData.imatge instanceof File) {
        formData.append("imatge", updatedData.imatge);
    }

    fetch("http://localhost:8080/back/back.php?action=editarPregunta", {
        method: "POST",
        body: formData,
    }).then(() => fetchData());
}

function handleDelete(id) {
    fetch("http://localhost:8080/back/back.php?action=esborrarPregunta", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
    }).then(() => fetchData());
}

window.addEventListener("DOMContentLoaded", () => {
    fetchData();

    // document.getElementById("crear").addEventListener("click", () => {
    //     showCrearForm(handleCreate);
    // });

    document.getElementById("editar").addEventListener("click", (e) => {
        const id = parseInt(e.target.dataset.id);
        const item = data.find((q) => q.id === id);
        if (item) {
            showEditarForm(item, handleEdit);
        } else {
            console.error("No se encontró el elemento con el ID:", id);
        }
    });

    document.getElementById("llista").addEventListener("click", (e) => {
        if (e.target.classList.contains("edit-button")) {
            const id = parseInt(e.target.dataset.id);
            const item = data.find((q) => parseInt(q.id) === id);
            if (item) {
                showEditarForm(item, handleEdit);
            } else {
                console.error("No se encontró el elemento con el ID:", id);
            }
        }
        if (e.target.classList.contains("create-button")) {
            showCrearForm(handleCreate);
        }
    });
});