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
    console.log("Datos nuevos para enviar:", newData);
    fetch("http://localhost:8080/back/back.php?action=crearPregunta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newData),
    }).then(() => fetchData());
}

function handleEdit(updatedData) {
    console.log("Datos actualizados para enviar:", updatedData);
    fetch("http://localhost:8080/back/back.php?action=editarPregunta", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
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