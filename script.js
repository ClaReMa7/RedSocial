const urlBase = 'https://jsonplaceholder.typicode.com/posts'; // url con la que se va a interactuar
let posts = [] // inicializamos los posteos con un array vacio

function getData() {
    fetch(urlBase)
    .then(res => res.json())
    .then(data => {
        posts = data
        //método para mostrar la información en pantalla
        renderPostList() 
    })
    .catch(error => console.error('Error al llamar a la API', error))
}
getData()

function renderPostList() {
    const postList = document.getElementById('postList');
    postList.innerHTML = ''

    posts.forEach(post => {
        const listItem = document.createElement('li');
        listItem.classList.add('postItem')
        // inserción HTML
        listItem.innerHTML = `
        
        <strong>${post.title}</strong>
        <p>${post.body}</p>
        <button onclick="editPost(${post.id})" class="buttonPost"><i class="fa-solid fa-pen-to-square"></i>Editar</button>
        <button onclick="deletePost(${post.id})" class="buttonPost"><i class="fa-solid fa-trash-can"></i>Borrar</button>

        <div id="editForm-${post.id}" class="editForm" style="display:none">
            <div>
                <label for="editTitle">Título: </label>
                <input type="text" id="editTitle-${post.id}" value="${post.title}" required>
            </div>
            <div>
                <label for="editBody">Comentario: </label>
                <textarea id="editBody-${post.id}" required>${post.body}</textarea>
            </div>
            <button class="buttonPost" onclick="updatePost(${post.id})"> Actualizar </button>
        </div>
        `

        postList.appendChild(listItem)
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const postForm = document.getElementById('postForm');
    postForm.addEventListener('submit', postData);
})

function postData(event) {

    event.preventDefault();

    const postTitle = document.getElementById('postTitle').value;
    const postBody = document.getElementById('postBody').value;
    
    if (postTitle.trim() == '' || postBody.trim() == '') {
        alert('Los campos son obligatorios')
        return
    }

    fetch (urlBase, {
        method: 'POST',
        body: JSON.stringify({
            title: postTitle,
            body: postBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        posts.unshift(data) //unshift para que el posteo que al principio
        renderPostList();
        //limpia los campos del form una vez creado un post
        document.getElementById('postTitle').value = '';
        document.getElementById('postBody').value = '';
    })
    .catch (error => console.log('Error crear posteo: ', error))
} 

function editPost(id) {
    const editForm = document.getElementById(`editForm-${id}`);
    editForm.style.display = (editForm.style.display == 'none') ? 'block' : 'none'
}

function updatePost(id) {
    const editTitle = document.getElementById(`editTitle-${id}`).value;
    const editBody = document.getElementById(`editBody-${id}`).value;

    fetch (`${urlBase}/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            id: id,
            title: editTitle,
            body: editBody,
            userId: 1,
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        },
    })
    .then(res => res.json())
    .then(data => {
        const index = posts.findIndex(post => post.id === data.id)
        if (index != -1) {
            posts[index] = data
        }else {
            alert('Error al actualizar la información del posteo')
        }
        renderPostList()
    })
    .catch(error => console.log('Error al actualizar posteo', error))

}

function deletePost (id) {
    fetch (`${urlBase}/${id}`, {
        method: 'DELETE',
    })
    .then(res => {
        if (res.ok) {
            posts = posts.filter(posts => posts.id != id)
            renderPostList();
        }else {
            alert('ocurrió un error y no se eliminó el posteo')
        }
    })
    .catch (error => console.log('Se ha producido un error', error))
}