import { showCrearForm } from "./crear.js";
import { fetchData } from "./script.js";

const principalContainer = document.getElementById("llista");
const crearContainer = document.getElementById("crear");
const editarContainer = document.getElementById("editar");

let URL = "http://localhost:8080";

// Mostra la llista principal de preguntes amb opcions per editar i eliminar
export function showPrincipalList(data, onEdit, onDelete, onCreate) {
  principalContainer.innerHTML = `
        <center><button class="returnQuest">Tornar al qüestionari</button></center>
        <h2>Llista de Preguntes</h2>
        <center>
        <button class="create-button">Crear Nova Pregunta</button>
        <ul>
            ${data
              .map(
                (item) => `
                <li class="crud">
                    ${item.pregunta}
                    <img src='${URL}/img/${
                  item.imatge
                }?t=${Date.now()}' alt='Pregunta ${
                  item.id
                }' style='max-width: 200px; display: block; margin-top: 10px;'/>
                    <ul>
                        ${item.respostes
                          .map(
                            (resposta) => `
                                <li class="crud-question">${
                                  resposta.id == item.resposta_correcta
                                    ? `<strong>${resposta.etiqueta}</strong>`
                                    : resposta.etiqueta
                                }</li>
                            `
                          )
                          .join("")}
                    </ul>
                    <button class="edit-button" data-id="${
                      item.id
                    }">Editar</button>
                    <button class="delete-button" data-id="${
                      item.id
                    }">Eliminar</button>
                </li>
            `
              )
              .join("")}
        </ul>
        </center>
    `;

  // Afegeix esdevenidor al botó de tornar al qüestionari
  const returnQuest = principalContainer.querySelector(".returnQuest");
  returnQuest.addEventListener("click", () => {
    window.location.href = "./index.html";
  });

  // Afegeix esdevenidors als botons
  const crearButton = principalContainer.querySelectorAll(".create-button");
  crearButton.forEach((button) => {
    button.addEventListener("click", () => {
      principalContainer.style.display = "none";
      showCrearForm(onCreate);
    });
  });

  // Afegeix esdevenidors als botons d'editar
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

  // Afegeix esdevenidors als botons de eliminar
  const deleteButtons = principalContainer.querySelectorAll(".delete-button");
  deleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = parseInt(button.getAttribute("data-id"));
      if (confirm("Estás segur que vols eliminar aquesta pregunta?")) {
        onDelete(id);
      }
    });
  });
}

// Funció per mostrar la vista principal i amagar les altres vistes
export function showAll() {
  fetchData();
  principalContainer.style.display = "block";
  crearContainer.style.display = "none";
  editarContainer.style.display = "none";
}