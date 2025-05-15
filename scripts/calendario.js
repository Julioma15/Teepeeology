document.addEventListener('DOMContentLoaded', function () {
    const calendarEl = document.getElementById('calendar');

    // Inicializar el calendario
    const calendar = new FullCalendar.Calendar(calendarEl, {
        locale: 'es',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth'
        },
        initialView: 'dayGridMonth',
        navLinks: true,
        editable: true,
        events: async function (fetchInfo, successCallback, failureCallback) {
            try {
                // Obtener eventos desde el backend
                const response = await fetch('http://localhost:8000/api/reservaciones');
                if (!response.ok) {
                    throw new Error('Error al cargar las reservaciones.');
                }
                const events = await response.json();
                successCallback(events); // Pasar los eventos al calendario
            } catch (error) {
                console.error('Error al cargar eventos:', error);
                failureCallback(error);
            }
        },
    });

    calendar.render();

    // Lógica para manejar el modal y agregar eventos
    const saveEventButton = document.getElementById('saveEventButton');
    const eventForm = document.getElementById('eventForm');
    const eventNameInput = document.getElementById('eventName');
    const eventStartInput = document.getElementById('eventStart');
    const eventEndInput = document.getElementById('eventEnd');

    saveEventButton.addEventListener('click', async () => {
        const eventName = eventNameInput.value.trim();
        const eventStart = eventStartInput.value;
        const eventEnd = eventEndInput.value;

        // Validar que todos los campos estén llenos
        if (!eventName || !eventStart || !eventEnd) {
            alert('Todos los campos son obligatorios.');
            return;
        }

        // Validar que la fecha de inicio sea anterior o igual a la fecha de fin
        if (new Date(eventStart) > new Date(eventEnd)) {
            alert('La fecha de inicio no puede ser posterior a la fecha de fin.');
            return;
        }

        try {
            // Enviar el evento al backend
            const response = await fetch('http://localhost:8000/api/reservaciones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: eventName, // Cambia 'titulo' por 'title'
                    start: eventStart,
                    end: eventEnd,
                }),
            });

            if (!response.ok) {
                throw new Error('Error al guardar la reservación.');
            }

            const newEvent = await response.json();

            // Agregar el evento al calendario
            calendar.addEvent(newEvent);

            // Limpiar el formulario y cerrar el modal
            eventForm.reset();
            const eventModal = bootstrap.Modal.getInstance(document.getElementById('eventModal'));
            eventModal.hide();
        } catch (error) {
            console.error('Error al guardar la reservación:', error);
            alert('Hubo un problema al guardar la reservación.');
        }
    });
});