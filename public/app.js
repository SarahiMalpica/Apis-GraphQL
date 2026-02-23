const $ = (id) => document.getElementById(id);
const lista = $("lista");

const api = "/api/libros";
let estadoLibros = [];

function render(libros) {
  estadoLibros = Array.isArray(libros) ? libros : [];
  lista.textContent = "";
  const frag = document.createDocumentFragment();

  for (const l of libros) {
    const li = document.createElement("li");
    li.className = "item";

    const left = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = l.titulo;
    const small = document.createElement("small");
    small.textContent = l.autor;
    left.append(strong, small);

    const btn = document.createElement("button");
    btn.className = "danger";
    btn.type = "button";
    btn.dataset.del = String(l.id);
    btn.textContent = "Eliminar";

    const edit = document.createElement("button");
    edit.className = "secondary";
    edit.type = "button";
    edit.dataset.edit = String(l.id);
    edit.textContent = "Editar";

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "8px";
    right.append(edit, btn);

    li.append(left, right);
    frag.append(li);
  }

  lista.append(frag);
}

async function cargar() {
  const res = await fetch(api);
  render(await res.json());
}

$("form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const titulo = $("titulo").value.trim();
  const autor = $("autor").value.trim();

  const res = await fetch(api, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titulo, autor }),
  });

  if (!res.ok) return;
  $("form").reset();
  await cargar();
});

lista.addEventListener("click", async (e) => {
  const delBtn = e.target?.closest?.("button[data-del]");
  if (delBtn?.dataset?.del) {
    const id = delBtn.dataset.del;
    const res = await fetch(`${api}/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    await cargar();
    return;
  }

  const editBtn = e.target?.closest?.("button[data-edit]");
  if (editBtn?.dataset?.edit) {
    const id = editBtn.dataset.edit;
    const libro = estadoLibros.find((x) => String(x.id) === String(id));
    if (!libro) return;

    const nuevoTitulo = prompt("Nuevo título:", libro.titulo);
    if (nuevoTitulo === null) return;
    const nuevoAutor = prompt("Nuevo autor:", libro.autor);
    if (nuevoAutor === null) return;

    const res = await fetch(`${api}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titulo: nuevoTitulo.trim(), autor: nuevoAutor.trim() }),
    });
    if (!res.ok) return;
    await cargar();
    return;
  }
});

cargar().catch(() => {});
