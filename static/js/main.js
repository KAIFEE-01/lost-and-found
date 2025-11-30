// University Lost and Found System - Main JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            document.querySelector('nav').classList.toggle('mobile-menu-open');
        });
    }

    // Filter functionality
    const filterCategory = document.getElementById('filter-category');
    const filterType = document.getElementById('filter-type');
    
    if (filterCategory && filterType) {
        const applyFilters = async () => {
            const category = filterCategory.value;
            const type = filterType.value;
            
            try {
                const spinner = document.createElement('div');
                spinner.className = 'spinner';
                document.querySelector('.items-grid').innerHTML = '';
                document.querySelector('.items-grid').appendChild(spinner);
                
                const response = await fetch(`/api/items?category=${category}&type=${type}`);
                const data = await response.json();
                
                renderItems(data.items);
            } catch (error) {
                console.error('Error applying filters:', error);
            }
        };
        
        filterCategory.addEventListener('change', applyFilters);
        filterType.addEventListener('change', applyFilters);
    }
    
    // Function to render items
    function renderItems(items) {
        const itemsGrid = document.querySelector('.items-grid');
        if (!itemsGrid) return;
        
        itemsGrid.innerHTML = '';
        
        if (items.length === 0) {
            itemsGrid.innerHTML = '<p class="no-items">No items found matching the criteria.</p>';
            return;
        }
        
        items.forEach(item => {
            const isLost = item.status === 'lost';
            const dateField = isLost ? 'date_lost' : 'date_found';
            const dateLabel = isLost ? 'Lost on' : 'Found on';
            
            const card = document.createElement('div');
            card.className = 'card slide-up';
            
            // Only include image for found items
            let imageHtml = '';
            if (!isLost && item.image) {
                imageHtml = `<img src="${item.image}" alt="${item.title}" class="card-img">`;
            }
            
            card.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <div class="tags">
                        <span class="badge ${isLost ? 'badge-lost' : 'badge-found'}">${isLost ? 'Lost' : 'Found'}</span>
                        <span class="tag">${item.category}</span>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span>${dateLabel}: ${item[dateField]}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${item.location}</span>
                    </div>
                    <p class="card-description">${item.description}</p>
                    <div class="card-actions">
                        ${isLost 
                            ? '<button class="btn btn-primary">I Found This</button>' 
                            : `<a href="/claim/${item.id}" class="btn btn-primary">Claim This Item</a>`}
                    </div>
                </div>
            `;
            
            itemsGrid.appendChild(card);
        });
    }
    
    // Form submission for potential matches
    const lostForm = document.getElementById('lost-form');
    const foundForm = document.getElementById('found-form');
    
    if (lostForm) {
        const checkForMatches = async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            
            if (!title || !description) return;
            
            try {
                const response = await fetch('/api/check-matches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'lost',
                        title,
                        description
                    })
                });
                
                const data = await response.json();
                showMatchSuggestions(data.matches);
            } catch (error) {
                console.error('Error checking matches:', error);
            }
        };
        
        document.getElementById('title').addEventListener('blur', checkForMatches);
        document.getElementById('description').addEventListener('blur', checkForMatches);
    }
    
    if (foundForm) {
        const checkForMatches = async (e) => {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            
            if (!title || !description) return;
            
            try {
                const response = await fetch('/api/check-matches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'found',
                        title,
                        description
                    })
                });
                
                const data = await response.json();
                showMatchSuggestions(data.matches);
            } catch (error) {
                console.error('Error checking matches:', error);
            }
        };
        
        document.getElementById('title').addEventListener('blur', checkForMatches);
        document.getElementById('description').addEventListener('blur', checkForMatches);
    }
    
    function showMatchSuggestions(matches) {
        let matchSuggestion = document.querySelector('.match-suggestion');
        
        if (matches.length === 0) {
            if (matchSuggestion) {
                matchSuggestion.remove();
            }
            return;
        }
        
        if (!matchSuggestion) {
            matchSuggestion = document.createElement('div');
            matchSuggestion.className = 'match-suggestion fade-in';
            
            const formContainer = document.querySelector('.form-container');
            if (formContainer) {
                formContainer.appendChild(matchSuggestion);
            }
        }
        
        matchSuggestion.innerHTML = `
            <h3>Potential Matches Found!</h3>
            <p>We found ${matches.length} item(s) that might match what you're reporting:</p>
            <div class="matches-list">
                ${matches.map(item => `
                    <div class="match-item">
                        <strong>${item.title}</strong> - ${item.description} (${item.location})
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Flash messages auto-close
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => message.remove(), 500);
        }, 5000);
    });
    
    // Stats counter animation
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length > 0) {
        const options = {
            threshold: 0.5
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'));
                    let count = 0;
                    const updateCount = () => {
                        target.textContent = count;
                        if (count < countTo) {
                            count = Math.min(count + Math.ceil(countTo / 20), countTo);
                            requestAnimationFrame(updateCount);
                        }
                    };
                    updateCount();
                    observer.unobserve(target);
                }
            });
        }, options);
        
        stats.forEach(stat => {
            observer.observe(stat);
        });
    }
});