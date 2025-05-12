document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form'); // Selecciona el formulario

    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita que el formulario recargue la página

        // Captura los datos del formulario
        const email = form.correo.value;
        const password = form.contraseña.value;

        try {
            // Envía los datos al backend
            const response = await fetch('http://localhost:8000/api/usuarios/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (response.ok) {
                const data = await response.json();
                alert('Inicio de sesión exitoso');
                console.log('Respuesta del servidor:', data);

                // Guarda el token en el almacenamiento local (opcional)
                localStorage.setItem('token', data.token);

                // Guarda el nombre del usuario en localStorage después de iniciar sesión
                localStorage.setItem('username', data.username); // Asegúrate de que el backend envíe el nombre del usuario

                // Redirige al usuario a la página principal o dashboard
                window.location.href = '/frontend/catalogo.html';
            } else {
                const errorData = await response.json();
                alert(`Error: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            alert('Hubo un problema al iniciar sesión.');
        }
    });
});