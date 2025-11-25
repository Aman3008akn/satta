document.addEventListener('DOMContentLoaded', () => {
    // Initialize the API client
    const apiClient = new SattaKingApiClient();
    
    // Function to fetch real-time data
    async function fetchRealTimeData() {
        try {
            console.log('Fetching real-time data...');
            
            // Fetch game results
            const gameResults = await apiClient.fetchGameResults();
            
            // Fetch monthly chart data
            const chartData = await apiClient.fetchMonthlyChart();
            
            // Update the last updated timestamp
            const now = new Date();
            const timeString = now.toLocaleString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: false,
                timeZoneName: 'short'
            });
            
            const timeElement = document.getElementById('last-updated');
            if (timeElement) {
                timeElement.innerHTML = `Updated: <time datetime="${now.toISOString()}">${timeString}</time> IST.`;
            }
            
            // Update DOM with the fetched data
            apiClient.updateGameResultsInDOM(gameResults);
            apiClient.updateChartInDOM(chartData);
            
            console.log('Real-time data updated successfully');
        } catch (error) {
            console.error('Error fetching real-time data:', error);
            // Even if API fails, we still update the timestamp
            updateTimestampOnly();
        }
    }
    
    // Function to only update the timestamp (fallback)
    function updateTimestampOnly() {
        const now = new Date();
        const timeString = now.toLocaleString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false,
            timeZoneName: 'short'
        });
        
        const timeElement = document.getElementById('last-updated');
        if (timeElement) {
            timeElement.innerHTML = `Updated: <time datetime="${now.toISOString()}">${timeString}</time> IST.`;
        }
    }
    
    // Function to continuously fetch data
    function startRealTimeUpdates() {
        // Update immediately
        fetchRealTimeData();
        
        // Update every 30 seconds
        setInterval(fetchRealTimeData, 30000);
    }
    
    // Start real-time updates
    startRealTimeUpdates();
});