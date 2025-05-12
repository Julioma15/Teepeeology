// Manejo del estado del usuario
document.addEventListener('DOMContentLoaded', () => {
    const userSection = document.getElementById('user-section');
    const username = localStorage.getItem('username'); // Obtén el nombre del usuario

    if (username) {
        // Si el usuario ha iniciado sesión, muestra un menú desplegable
        userSection.innerHTML = `
            <div class="dropdown">
                <button class="btn btn-primary btn-sm dropdown-toggle" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    Hola, ${username}
                </button>
                <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                    <li><button class="dropdown-item text-danger" id="logout-btn">Cerrar Sesión</button></li>
                </ul>
            </div>
        `;

        // Agrega funcionalidad al botón de cerrar sesión
        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('username'); // Elimina el nombre del usuario
            localStorage.removeItem('token'); // Elimina el token si lo usas
            window.location.reload(); // Recarga la página
        });
    }
});

// Manejo de clics en las imágenes de los paquetes
document.addEventListener('DOMContentLoaded', () => {
    const paquetes = document.querySelectorAll('.paquete'); // Selecciona todas las imágenes con la clase "paquete"

    paquetes.forEach(paquete => {
        paquete.addEventListener('click', async () => {
            const paqueteId = paquete.getAttribute('data-id'); // Obtén el ID del paquete
            const username = localStorage.getItem('username'); // Obtén el nombre del usuario desde el localStorage

            if (!username) {
                // Si el usuario no ha iniciado sesión, redirige al login
                alert('Debes iniciar sesión para seleccionar un paquete.');
                window.location.href = '/frontend/login.html';
                return;
            }

            try {
                // Obtener los datos del paquete desde el backend
                const paqueteResponse = await fetch(`http://localhost:8000/api/paquetes/${paqueteId}`);
                if (!paqueteResponse.ok) {
                    throw new Error('Error al obtener los datos del paquete.');
                }
                const paqueteData = await paqueteResponse.json();

                // Crear la reserva en el backend
                const reservaResponse = await fetch('http://localhost:8000/api/reservas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: username,
                        paqueteName: paqueteData.name,
                        paqueteType: paqueteData.type,
                        paquetePrice: paqueteData.price,
                    }),
                });

                if (!reservaResponse.ok) {
                    throw new Error('Error al crear la reserva.');
                }

                alert('Reserva creada exitosamente.');
                // Redirige al calendario
                window.location.href = '/frontend/calendario.html';
            } catch (error) {
                console.error('Error:', error);
                alert('Hubo un problema al procesar tu solicitud.');
            }
        });
    });
});