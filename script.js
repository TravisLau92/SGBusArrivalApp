document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('search-button');
    const busStopInput = document.getElementById('bus-stop-id');
    const busTimesList = document.getElementById('bus-times-list');

    searchButton.addEventListener('click', async () => {
        const busStopId = busStopInput.value;
        if (busStopId) {
            await fetchBusArrivalTimes(busStopId);
        }
    });

    async function fetchBusArrivalTimes(busStopId) {
        const url = `https://arrivelah2.busrouter.sg/?id=${busStopId}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            const data = await response.json();

            // Clear previous results
            let htmlContent = '';

            if (data.services) {
                data.services.forEach(service => {
                    const nextBusMinutes = Math.round(service.next.duration_ms / 60000); // Convert milliseconds to minutes
                    htmlContent += `<li>Bus ${service.no} arrives in ${nextBusMinutes} minutes</li>`;
                });
            } else {
                htmlContent = '<li>No bus arrival data available.</li>';
            }

            busTimesList.innerHTML = htmlContent;
        } catch (error) {
            console.error('Error fetching bus arrival times:', error);
            busTimesList.innerHTML = '<li>Failed to fetch bus arrival times. Please try again later.</li>';
        }
    }
});