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
    
    // Sync dropdown with URL parameter if present
    const urlParams = new URLSearchParams(window.location.search);
    const initialCategory = urlParams.get('category');
    if (initialCategory && filterCategory) {
        filterCategory.value = initialCategory;
    }

    if (filterCategory && filterType) {
        const applyFilters = async () => {
            const category = filterCategory.value;
            const type = filterType.value;
            
            try {
                const itemsGrid = document.querySelector('.items-grid');
                if (itemsGrid) {
                    itemsGrid.innerHTML = '<div class="spinner"></div>';
                }
                
                const response = await fetch(`/api/items?category=${encodeURIComponent(category)}&type=${encodeURIComponent(type)}`);
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
        
        if (!items || items.length === 0) {
            itemsGrid.innerHTML = '<p class="no-items" style="grid-column: 1 / -1; text-align: center; padding: 3rem 1rem; color: var(--neutral-500);">No items found matching the criteria.</p>';
            return;
        }
        
        items.forEach(item => {
            const isLost = item.status === 'lost';
            const dateField = isLost ? 'date_lost' : 'date_found';
            const dateLabel = isLost ? 'Lost on' : 'Found on';
            const dateValue = item[dateField] || item.date_lost || item.date_found || 'Recently';
            
            const card = document.createElement('div');
            card.className = 'card slide-up';
            
            // Only include image for found items if available
            let imageHtml = '';
            if (item.image) {
                imageHtml = `<img src="${item.image}" alt="${item.title}" class="card-img">`;
            }
            
            card.innerHTML = `
                ${imageHtml}
                <div class="card-content">
                    <div class="tags">
                        <span class="badge ${isLost ? 'badge-lost' : 'badge-found'}">${isLost ? 'Lost' : 'Found'}</span>
                        <span class="tag">${item.category || 'General'}</span>
                    </div>
                    <h3 class="card-title">${item.title}</h3>
                    <div class="card-meta">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-calendar"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>
                        <span>${dateLabel}: ${dateValue}</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide-map-pin"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                        <span>${item.location}</span>
                    </div>
                    <p class="card-description">${item.description}</p>
                    <div class="card-actions">
                        ${isLost 
                            ? '<a href="/report-found" class="btn btn-primary">I Found This</a>' 
                            : `<a href="/claim/${item.id}" class="btn btn-primary">Claim This Item</a>`}
                    </div>
                </div>
            `;
            
            itemsGrid.appendChild(card);
        });
    }
    
    // Check for potential matches on report forms
    const lostForm = document.getElementById('lost-form');
    const foundForm = document.getElementById('found-form');
    
    const setupMatchChecker = (formElement, formType) => {
        if (!formElement) return;
        
        const titleInput = formElement.querySelector('#title');
        const descInput = formElement.querySelector('#description');
        
        if (!titleInput || !descInput) return;
        
        const checkMatches = async () => {
            const title = titleInput.value.trim();
            const description = descInput.value.trim();
            
            if (title.length < 3 && description.length < 3) {
                showMatchSuggestions([], formElement);
                return;
            }
            
            try {
                const response = await fetch('/api/check-matches', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: formType,
                        title,
                        description
                    })
                });
                
                if (response.ok) {
                    const data = await response.json();
                    showMatchSuggestions(data.matches, formElement);
                }
            } catch (error) {
                console.error('Error checking matches:', error);
            }
        };
        
        titleInput.addEventListener('blur', checkMatches);
        descInput.addEventListener('blur', checkMatches);
    };
    
    setupMatchChecker(lostForm, 'lost');
    setupMatchChecker(foundForm, 'found');
    
    function showMatchSuggestions(matches, parentForm) {
        let matchSuggestion = parentForm.querySelector('.match-suggestion');
        
        if (!matches || matches.length === 0) {
            if (matchSuggestion) {
                matchSuggestion.remove();
            }
            return;
        }
        
        if (!matchSuggestion) {
            matchSuggestion = document.createElement('div');
            matchSuggestion.className = 'match-suggestion fade-in';
            const form = parentForm.querySelector('form');
            if (form) {
                form.parentNode.insertBefore(matchSuggestion, form);
            } else {
                parentForm.appendChild(matchSuggestion);
            }
        }
        
        matchSuggestion.innerHTML = `
            <h3>Potential Matches Found!</h3>
            <p>We found ${matches.length} existing item(s) that might match what you're reporting:</p>
            <div class="matches-list">
                ${matches.map(item => `
                    <div class="match-item">
                        <strong>${item.title}</strong> (${item.category}) - ${item.description} - <em>Location: ${item.location}</em>
                        ${item.status === 'found' ? ` <br><a href="/claim/${item.id}" style="color: var(--primary-color); font-weight: 600; font-size: 0.875rem;">View & Claim Item &rarr;</a>` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Flash messages auto-close
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(message => {
        message.style.transition = 'opacity 0.5s ease';
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
                    const countTo = parseInt(target.getAttribute('data-count'), 10) || 0;
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
