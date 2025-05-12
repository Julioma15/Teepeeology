document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Selecciona el formulario

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Captura los datos del formulario
        const username = form.nombre.value;
        const email = form.correo.value;
        const password = form.contraseña.value;

        try {
            // Envía los datos al backend
            const response = await fetch('http://localhost:8000/api/usuarios/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Usuario registrado exitosamente');
                console.log('Respuesta del servidor:', data);

                // Redirige al usuario al login o a otra página
                window.location.href = '/frontend/login.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al registrar el usuario:', error);
            alert('Hubo un problema al registrar el usuario.');
        }
    });
});