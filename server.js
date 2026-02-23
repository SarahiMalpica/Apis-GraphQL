const express = require('express');
const app = express();
const PORT = 4000; 

app.use(express.json());
app.use(express.static('public'));

// Permite consumir la API desde otros orígenes (por ejemplo, Live Server en otro puerto).
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    next();
});

// BASE DE DATOS (en memoria)

let libros = [
    { id: 1, titulo: 'Cien Años de Soledad', autor: 'Gabriel García Márquez' },
    { id: 2, titulo: 'Don Quijote de la Mancha', autor: 'Miguel de Cervantes' },
    { id: 3, titulo: 'La Sombra del Viento', autor: 'Carlos Ruiz Zafón' }
];

let nextId = libros.reduce((maxId, libro) => Math.max(maxId, libro.id), 0) + 1;

// OPERACION GET: obtener todos los libros

// Obtener todos los libros
app.get('/api/libros', (req, res) => {
    res.json(libros);
});

// OPERACION POST: agregar un nuevo libro

// Agregar un nuevo libro
app.post('/api/libros', (req, res) => {
    const nuevoLibro = {
        id: nextId++,
        titulo: req.body.titulo,
        autor: req.body.autor
    };

    libros.push(nuevoLibro);
    res.status(201).json(nuevoLibro);
}); 

// OPERACION PUT: actualizar un libro existente

// Actualizar un libro existente
app.put('/api/libros/:id', (req, res) => {
    const libroId = parseInt(req.params.id);
    const libro = libros.find(b => b.id === libroId);

    if (libro) {
        libro.titulo = req.body.titulo || libro.titulo;
        libro.autor = req.body.autor || libro.autor;
        res.json(libro);
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

// OPERACION DELETE: eliminar un libro

// Eliminar un libro
app.delete('/api/libros/:id', (req, res) => {
    const libroId = parseInt(req.params.id);
    const index = libros.findIndex(b => b.id === libroId);

    if (index !== -1) {
        libros.splice(index, 1);
        res.json({ message: 'Libro eliminado' });
    } else {
        res.status(404).json({ message: 'Libro no encontrado' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});          
