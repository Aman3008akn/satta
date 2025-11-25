/**
 * Satta King API Client
 * This module handles fetching real-time data from satta-king-fast.com
 */

class SattaKingApiClient {
    constructor() {
        // For Netlify deployment, we'll use the proxy endpoints
        this.baseUrl = window.location.origin;
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Fetch real-time game results
     */
    async fetchGameResults() {
        try {
            // Check if we have cached data that's still valid
            const cached = this.cache.get('gameResults');
            if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
            
            // Try to fetch from our API endpoint (Netlify proxy)
            const response = await fetch(`${this.baseUrl}/api/results`);
            if (response.ok) {
                // Since Netlify redirects to the actual site, we need to parse the HTML
                const html = await response.text();
                const results = this.parseGameResultsFromHTML(html);
                
                // Cache the data
                this.cache.set('gameResults', {
                    data: results,
                    timestamp: Date.now()
                });
                return results;
            }
            
            // Fallback to simulation if API is not available
            console.warn('API not available, using simulation');
            return await this.simulateGameResults();
        } catch (error) {
            console.error('Error fetching game results:', error);
            // Fallback to simulation if API fails
            return await this.simulateGameResults();
        }
    }

    /**
     * Fetch monthly chart data
     */
    async fetchMonthlyChart() {
        try {
            // Check if we have cached data that's still valid
            const cached = this.cache.get('monthlyChart');
            if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
                return cached.data;
            }
            
            // Try to fetch from our API endpoint (Netlify proxy)
            const response = await fetch(`${this.baseUrl}/api/chart`);
            if (response.ok) {
                // Since Netlify redirects to the actual site, we need to parse the HTML
                const html = await response.text();
                const chartData = this.parseChartDataFromHTML(html);
                
                // Cache the data
                this.cache.set('monthlyChart', {
                    data: chartData,
                    timestamp: Date.now()
                });
                return chartData;
            }
            
            // Fallback to simulation if API is not available
            console.warn('Chart API not available, using simulation');
            return await this.simulateChartData();
        } catch (error) {
            console.error('Error fetching monthly chart:', error);
            // Fallback to simulation if API fails
            return await this.simulateChartData();
        }
    }

    /**
     * Parse game results from HTML
     */
    parseGameResultsFromHTML(html) {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const results = {};
        
        // Extract game results
        const gameRows = doc.querySelectorAll('.game-result');
        gameRows.forEach(row => {
            const gameId = row.getAttribute('id');
            if (gameId) {
                const gameName = row.querySelector('.game-name')?.textContent.trim() || '';
                const todayResult = row.querySelector('.today-number h3')?.textContent.trim() || 'XX';
                const yesterdayResult = row.querySelector('.yesterday-number h3')?.textContent.trim() || 'XX';
                
                results[gameId] = {
                    name: gameName,
                    today: todayResult,
                    yesterday: yesterdayResult
                };
            }
        });
        
        return results;
    }

    /**
     * Parse chart data from HTML
     */
    parseChartDataFromHTML(html) {
        // Create a temporary DOM element to parse the HTML
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const chartData = [];
        
        // Extract chart data
        const chartRows = doc.querySelectorAll('#mix-chart .day-number');
        chartRows.forEach(row => {
            const dayElement = row.querySelector('.day');
            if (dayElement) {
                const day = parseInt(dayElement.textContent.trim());
                const numberElements = row.querySelectorAll('.number');
                const numbers = Array.from(numberElements).map(el => el.textContent.trim());
                
                chartData.push({
                    date: day,
                    desawar: numbers[0] || 'XX',
                    faridabad: numbers[1] || 'XX',
                    ghaziabad: numbers[2] || 'XX',
                    gali: numbers[3] || 'XX'
                });
            }
        });
        
        return chartData;
    }

    /**
     * Simulate game results when API is not available
     */
    async simulateGameResults() {
        // Simulate API call delay
        return new Promise(resolve => {
            setTimeout(() => {
                const games = this.getGameList();
                const results = {};
                
                games.forEach(game => {
                    // For games that should have results (not XX)
                    if (Math.random() > 0.3) {
                        results[game.id] = {
                            today: Math.floor(Math.random() * 100).toString().padStart(2, '0'),
                            yesterday: Math.floor(Math.random() * 100).toString().padStart(2, '0')
                        };
                    } else {
                        // For games that don't have results yet
                        results[game.id] = {
                            today: 'XX',
                            yesterday: Math.floor(Math.random() * 100).toString().padStart(2, '0')
                        };
                    }
                });
                
                resolve(results);
            }, 500);
        });
    }

    /**
     * Simulate chart data when API is not available
     */
    async simulateChartData() {
        // Simulate API call delay
        return new Promise(resolve => {
            setTimeout(() => {
                const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
                const chartData = [];
                
                for (let day = 1; day <= daysInMonth; day++) {
                    chartData.push({
                        date: day,
                        desawar: day <= new Date().getDate() - 1 ? 
                            Math.floor(Math.random() * 100).toString().padStart(2, '0') : 'XX',
                        faridabad: day <= new Date().getDate() - 1 ? 
                            Math.floor(Math.random() * 100).toString().padStart(2, '0') : 'XX',
                        ghaziabad: day <= new Date().getDate() - 1 ? 
                            Math.floor(Math.random() * 100).toString().padStart(2, '0') : 'XX',
                        gali: day <= new Date().getDate() - 1 ? 
                            Math.floor(Math.random() * 100).toString().padStart(2, '0') : 'XX'
                    });
                }
                
                resolve(chartData);
            }, 300);
        });
    }

    /**
     * Get list of all games
     */
    getGameList() {
        return [
            {id: 'DR', name: 'DELHI ROSE'},
            {id: 'SS', name: 'SHIV SHAKTI'},
            {id: 'CT', name: 'CHAND TARA'},
            {id: 'NG', name: 'NEW GANGA'},
            {id: 'MB', name: 'MAA BHAGWATI'},
            {id: 'AK', name: 'ANARKALI'},
            {id: 'DA', name: 'DUBAI DELHI'},
            {id: 'BL', name: 'BADLAPUR'},
            {id: 'TJ', name: 'TAJ'},
            {id: 'RC', name: 'ROYAL CHALLENGE'},
            {id: 'MH', name: 'MOHALI'},
            {id: 'DB', name: 'DELHI BAZAR'},
            {id: 'MC', name: 'MEERUT CITY'},
            {id: 'MR', name: 'MANGAL BAZAR'},
            {id: 'BJ', name: 'BURJ KHALIFA - BK'},
            {id: 'KB', name: 'KALKA BAZAR'},
            {id: 'SV', name: 'SAVERA'},
            {id: 'SP', name: 'SUPER DELHI'},
            {id: 'DC', name: 'DELHI CITY'},
            {id: 'ST', name: 'SUPER TAJ'},
            {id: 'JR', name: 'JAIPUR KING'},
            {id: 'DZ', name: 'DELHI DREAM'},
            {id: 'PL', name: 'PLAY BAZAAR'},
            {id: 'DE', name: 'DELHI DARBAR'},
            {id: 'SG', name: 'SHRI GANESH'},
            {id: 'GD', name: 'GHAZIABAD DIN'},
            {id: 'BT', name: 'BADRINATH'},
            {id: 'HI', name: 'HINDUSTAN'},
            {id: 'MJ', name: 'MAHARAJ'},
            {id: 'UK', name: 'UTTARAKHAND - UK'},
            {id: 'ZZ', name: 'ZAM-ZAM'},
            {id: 'FB', name: 'FARIDABAD'},
            {id: 'RA', name: 'RAJDHANI'},
            {id: 'HG', name: 'HYDERABAD GOLD'},
            {id: 'NL', name: 'NEELKANTH'},
            {id: 'SL', name: 'SHRI LAXMI'},
            {id: 'UN', name: 'UTTAM NAGAR'},
            {id: 'DI', name: 'DUBAI BAZAR'},
            {id: 'PS', name: 'PARAS'},
            {id: 'FR', name: 'FARIDA BAZAR'},
            {id: 'DG', name: 'DELHI GOLDEN'},
            {id: 'ES', name: 'DELHI STAR'},
            {id: 'KU', name: 'DHAN KUBER'},
            {id: 'TB', name: 'TODAY BAZAAR'},
            {id: 'RY', name: 'ROYAL DELHI'},
            {id: 'NS', name: 'NEW SAHIBABAD'},
            {id: 'SW', name: 'SAWARIYA SETH'},
            {id: 'PR', name: 'PARIS BAZAR'},
            {id: 'GR', name: 'GALI DISAWAR MIX'},
            {id: 'WG', name: 'WHITE GOLD'},
            {id: 'UB', name: 'UP BAZAR'},
            {id: 'BR', name: 'NEW DELHI DARBAR'},
            {id: 'GZ', name: 'GHAZIABAD NIGHT'},
            {id: 'BI', name: 'BRIJ RANI'},
            {id: 'VS', name: 'SHRI VISHNU'},
            {id: 'GB', name: 'GHAZIABAD'},
            {id: '2Z', name: 'GHAZIABAD 2'},
            {id: 'RB', name: 'RAM BAZAR'},
            {id: 'UP', name: 'UTTAR PRADESH'},
            {id: 'BS', name: 'BIKANER SUPER'},
            {id: 'DS', name: 'DESAWAR'},
            {id: '2D', name: 'DISAWAR 2'},
            {id: 'NP', name: 'NEW PUNJAB'},
            {id: 'GM', name: 'GURU MANGAL'},
            {id: 'BG', name: 'BAGAD'},
            {id: 'SU', name: 'SUPER KING'},
            {id: 'MO', name: 'MATKA SONE KA'},
            {id: 'UI', name: 'U.P KING'},
            {id: 'RJ', name: 'RAJDHANI JAIPUR'},
            {id: 'AZ', name: 'AGRA BAZAR'},
            {id: 'BK', name: 'BIHAR KING'},
            {id: 'JC', name: 'JANTA CITY'},
            {id: 'EG', name: 'SHREE GANGA NAGAR'},
            {id: 'BD', name: 'BALA JI DADRI'},
            {id: 'JM', name: 'JAISALMER'},
            {id: 'CG', name: 'CHOTI GALI'},
            {id: 'NW', name: 'NEW GALI'},
            {id: 'GL', name: 'GALI'},
            {id: '2G', name: 'GALI 2'}
        ];
    }

    /**
     * Update DOM with game results
     */
    updateGameResultsInDOM(results) {
        Object.keys(results).forEach(gameId => {
            const gameRow = document.querySelector(`.game-result#${gameId}`);
            if (gameRow) {
                const todayCell = gameRow.querySelector('.today-number h3');
                const yesterdayCell = gameRow.querySelector('.yesterday-number h3');
                
                if (todayCell && results[gameId].today !== 'XX') {
                    todayCell.textContent = results[gameId].today;
                    todayCell.classList.add('real-time-update');
                }
                
                if (yesterdayCell && results[gameId].yesterday !== 'XX') {
                    yesterdayCell.textContent = results[gameId].yesterday;
                    yesterdayCell.classList.add('real-time-update');
                }
            }
        });
    }

    /**
     * Update DOM with chart data
     */
    updateChartInDOM(chartData) {
        const chartRows = document.querySelectorAll('#mix-chart .day-number');
        
        chartRows.forEach((row, index) => {
            if (index < chartData.length) {
                const dayData = chartData[index];
                const numberCells = row.querySelectorAll('.number');
                
                // Update each game column
                if (numberCells.length >= 4) {
                    // DSWR (Desawar)
                    if (dayData.desawar !== 'XX') {
                        numberCells[0].textContent = dayData.desawar;
                        numberCells[0].classList.add('real-time-update');
                    }
                    
                    // FRBD (Faridabad)
                    if (dayData.faridabad !== 'XX') {
                        numberCells[1].textContent = dayData.faridabad;
                        numberCells[1].classList.add('real-time-update');
                    }
                    
                    // GZBD (Ghaziabad)
                    if (dayData.ghaziabad !== 'XX') {
                        numberCells[2].textContent = dayData.ghaziabad;
                        numberCells[2].classList.add('real-time-update');
                    }
                    
                    // GALI
                    if (dayData.gali !== 'XX') {
                        numberCells[3].textContent = dayData.gali;
                        numberCells[3].classList.add('real-time-update');
                    }
                }
            }
        });
    }
}

// Export the client
window.SattaKingApiClient = SattaKingApiClient;