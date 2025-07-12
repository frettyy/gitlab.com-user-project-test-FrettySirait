const cardsGrid = document.getElementById('cardsGrid');
const pagination = document.getElementById('pagination');
const header = document.getElementById('header');
const hero = document.getElementById('hero');
const heroContent = document.querySelector('.hero-content');
const showingInfo = document.getElementById('showingInfo');
let currentPage = parseInt(localStorage.getItem('currentPage')) || 1;
let cardsPerPage = parseInt(localStorage.getItem('cardsPerPage')) || 10;
let sortOrder = localStorage.getItem('sortOrder') || 'newest';
const totalCards = 100;
let lastScroll = 0;

const cardData = Array.from({ length: totalCards }, (_, i) => ({
    id: i + 1,
    title: `Kenali Tingkatan Influencers berdasarkan Jumlah Followers ${i + 1}`,
    date: '5 September 2022',
    image: `https://picsum.photos/250/200?random=${i + 1}`
}));

function sortCards(data) {
    return data.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
}

function renderCards(page) {
    cardsGrid.innerHTML = '';
    const start = (page - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    let sortedData = [...cardData];
    sortedData = sortCards(sortedData);
    const paginatedCards = sortedData.slice(start, end);

    paginatedCards.forEach(card => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card';
        cardElement.innerHTML = `
            <img src="${card.image}" alt="${card.title}" loading="lazy">
            <p>${card.date}</p>
            <p class="title">${card.title}</p>
        `;
        cardsGrid.appendChild(cardElement);
    });

    showingInfo.textContent = `Showing ${start + 1} - ${Math.min(end, totalCards)} of ${totalCards}`;
    renderPagination();
    localStorage.setItem('currentPage', page);
    localStorage.setItem('cardsPerPage', cardsPerPage);
    localStorage.setItem('sortOrder', sortOrder);
}

function renderPagination() {
    pagination.innerHTML = '';
    const totalPages = Math.ceil(totalCards / cardsPerPage);
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
        const prevBtn = document.createElement('button');
        prevBtn.textContent = '<<';
        prevBtn.addEventListener('click', () => {
            currentPage = Math.max(1, currentPage - 1);
            renderCards(currentPage);
        });
        pagination.appendChild(prevBtn);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.disabled = i === currentPage;
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            renderCards(currentPage);
        });
        pagination.appendChild(pageBtn);
    }

    if (endPage < totalPages) {
        const nextBtn = document.createElement('button');
        nextBtn.textContent = '>>';
        nextBtn.addEventListener('click', () => {
            currentPage = Math.min(totalPages, currentPage + 1);
            renderCards(currentPage);
        });
        pagination.appendChild(nextBtn);
    }
}

document.getElementById('per-page').value = cardsPerPage;
document.getElementById('sort-by').value = sortOrder;

document.getElementById('per-page').addEventListener('change', (e) => {
    cardsPerPage = parseInt(e.target.value);
    currentPage = 1;
    renderCards(currentPage);
});

document.getElementById('sort-by').addEventListener('change', (e) => {
    sortOrder = e.target.value;
    currentPage = 1;
    renderCards(currentPage);
});

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.classList.add('hidden');
        header.classList.remove('scrolled');
    } else if (currentScroll < lastScroll) {
        header.classList.remove('hidden');
        header.classList.add('scrolled');
    }
    lastScroll = currentScroll;

    const scrollPosition = window.pageYOffset;
    const heroHeight = hero.offsetHeight;
    const translateY = (scrollPosition * 0.5);
    hero.style.setProperty('--parallax-y', `${translateY}px`);
    heroContent.style.transform = `translateY(calc(-50% + ${scrollPosition * 0.3}px))`;
});

window.addEventListener('load', () => {
    const heroImage = hero.dataset.image;
    hero.style.setProperty('--hero-image', `url(${heroImage})`);
    renderCards(currentPage);
});

renderCards(currentPage);