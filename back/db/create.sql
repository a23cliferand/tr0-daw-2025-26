CREATE TABLE preguntes (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    pregunta TEXT NOT NULL,
    resposta1 TEXT NOT NULL,
    resposta2 TEXT NOT NULL,
    resposta3 TEXT NOT NULL,
    resposta4 TEXT NOT NULL,
    resposta_correcta INTEGER NOT NULL,
    imatge TEXT
);