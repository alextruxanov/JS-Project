// СПИСОК ВСЕХ БРЕНДОВ
const fullBrandsList = [
    { name: "", img: "img/lenovo.png" },
    { name: "", img: "img/bosch.png" },
    { name: "", img: "img/apple.png" },
    { name: "", img: "img/sonic.png" },
    { name: "", img: "img/bosch.png" },
    { name: "", img: "img/hp.png" },
    { name: "", img: "img/aser.png" },
    { name: "", img: "img/sony.png" },
    { name: "", img: "img/lenovo.png" },
    { name: "", img: "img/samsung.png" },
    { name: "", img: "img/apple.png" },
];

// Глобальные переменные
let isExpanded = false;
let currentLimit = 8;
let currentSlideIndex = 0;

const desktopGrid = document.getElementById('desktopBrandsGrid');
const sliderTrack = document.getElementById('sliderTrack');
const sliderPagination = document.getElementById('sliderPagination');
const toggleBtn = document.getElementById('toggleBtn');

// Функция: сколько брендов показывать в зависимости от ширины экрана
function getLimitByWidth() {
    const width = window.innerWidth;
    if (width <= 320) return 1;
    if (width <= 768) return 6;
    return 8;
}

// Функция: создание SVG стрелки
function getArrowSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 7 12" fill="none">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M4.08569 5.58569L0.292799 1.7928C-0.097725 1.40227 -0.0977242 0.769111 0.2928 0.378587L0.378586 0.292801C0.76911 -0.0977237 1.40228 -0.0977241 1.7928 0.2928L6.37859 4.87859C6.76911 5.26911 6.76911 5.90228 6.37859 6.2928L1.7928 10.8786C1.40228 11.2691 0.769111 11.2691 0.378587 10.8786L0.292801 10.7928C-0.0977237 10.4023 -0.0977241 9.76911 0.2928 9.37859L4.08569 5.58569Z" fill="#e31e24"/>
    </svg>`;
}

// Создание элемента бренда для десктопа
function createDesktopBrandElement(brand) {
    const link = document.createElement('a');
    link.className = 'brand-link';
    link.href = '#';
    
    const leftPart = document.createElement('span');
    leftPart.className = 'brand-content';
    
    const img = document.createElement('img');
    img.src = brand.img;
    img.alt = brand.name;
    img.className = 'brand-icon';
    img.onerror = () => { img.style.display = 'none'; };
    
    const text = document.createTextNode(brand.name);
    leftPart.appendChild(img);
    leftPart.appendChild(text);
    
    const arrow = document.createElement('span');
    arrow.className = 'brand-arrow';
    arrow.innerHTML = getArrowSVG();
    
    link.appendChild(leftPart);
    link.appendChild(arrow);
    
    link.addEventListener('click', (e) => {
        e.preventDefault();
        console.log(`Выбран бренд: ${brand.name}`);
    });
    
    return link;
}

// Создание слайда для мобильного слайдера
function createMobileSlide(brand, index) {
    const slide = document.createElement('div');
    slide.className = 'slider-item';
    slide.dataset.index = index;
    
    const leftPart = document.createElement('span');
    leftPart.className = 'slider-item-content';
    
    const img = document.createElement('img');
    img.src = brand.img;
    img.alt = brand.name;
    img.className = 'brand-icon-mobile';
    img.onerror = () => { img.style.display = 'none'; };
    
    const text = document.createTextNode(brand.name);
    leftPart.appendChild(img);
    leftPart.appendChild(text);
    
    const arrow = document.createElement('span');
    arrow.className = 'slider-arrow';
    arrow.innerHTML = getArrowSVG();
    
    slide.appendChild(leftPart);
    slide.appendChild(arrow);
    
    slide.addEventListener('click', () => {
        console.log(`Выбран бренд: ${brand.name}`);
    });
    
    return slide;
}

// Создание пагинации (кружочки)
function createPagination(slidesCount) {
    sliderPagination.innerHTML = '';
    
    for (let i = 0; i < slidesCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'pagination-dot';
        if (i === currentSlideIndex) {
            dot.classList.add('active');
        }
        dot.addEventListener('click', () => {
            goToSlide(i);
        });
        sliderPagination.appendChild(dot);
    }
}

// Переход к определенному слайду
function goToSlide(index) {
    const slides = sliderTrack.querySelectorAll('.slider-item');
    if (slides.length === 0) return;
    
    if (index < 0) index = 0;
    if (index >= slides.length) index = slides.length - 1;
    
    currentSlideIndex = index;
    
    // Прокручиваем к нужному слайду
    slides[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'start'
    });
    
    // Обновляем активные точки пагинации
    updatePaginationActive();
}

// Обновление активной точки пагинации
function updatePaginationActive() {
    const dots = sliderPagination.querySelectorAll('.pagination-dot');
    dots.forEach((dot, i) => {
        if (i === currentSlideIndex) {
            dot.classList.add('active');
        } else {
            dot.classList.remove('active');
        }
    });
}

// Отслеживание текущего слайда при скролле
function setupScrollObserver() {
    if (!sliderTrack) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = parseInt(entry.target.dataset.index);
                if (!isNaN(index) && index !== currentSlideIndex) {
                    currentSlideIndex = index;
                    updatePaginationActive();
                }
            }
        });
    }, { threshold: 0.5 });
    
    const slides = sliderTrack.querySelectorAll('.slider-item');
    slides.forEach(slide => observer.observe(slide));
}

// Отрисовка десктопной сетки
function renderDesktopGrid() {
    if (!desktopGrid) return;
    desktopGrid.innerHTML = '';
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentLimit;
    
    fullBrandsList.forEach((brand, index) => {
        const element = createDesktopBrandElement(brand);
        if (index >= visibleCount) {
            element.style.display = 'none';
        }
        desktopGrid.appendChild(element);
    });
}

// Отрисовка мобильного слайдера
function renderMobileSlider() {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = '';
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentLimit;
    const brandsToShow = fullBrandsList.slice(0, visibleCount);
    
    brandsToShow.forEach((brand, index) => {
        const slide = createMobileSlide(brand, index);
        sliderTrack.appendChild(slide);
    });
    
    // Создаем пагинацию
    createPagination(brandsToShow.length);
    currentSlideIndex = 0;
    
    // Настраиваем отслеживание скролла
    setTimeout(() => {
        setupScrollObserver();
    }, 100);
}

// Обновление видимости (для десктопа)
function updateDesktopVisibility() {
    if (!desktopGrid) return;
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentLimit;
    const allBrands = desktopGrid.querySelectorAll('.brand-link');
    
    allBrands.forEach((brand, index) => {
        if (index < visibleCount) {
            brand.style.display = 'inline-flex';
        } else {
            brand.style.display = 'none';
        }
    });
}

// Обновление UI в зависимости от типа устройства
function updateUI() {
    const isMobile = window.innerWidth <= 768;
    toggleBtn.textContent = isExpanded ? 'Скрыть' : 'Показать все';
    
    if (isMobile) {
        renderMobileSlider();
    } else {
        updateDesktopVisibility();
    }
}

// Обновление лимита при ресайзе
function updateLimit() {
    const newLimit = getLimitByWidth();
    
    if (newLimit !== currentLimit) {
        currentLimit = newLimit;
        
        if (!isExpanded) {
            const isMobile = window.innerWidth <= 768;
            if (isMobile) {
                renderMobileSlider();
            } else {
                updateDesktopVisibility();
            }
        }
    }
}

// Обработчик кнопки
function onToggleClick() {
    isExpanded = !isExpanded;
    updateUI();
}

// Обработчик ресайза
let resizeTimer;
function onWindowResize() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        updateLimit();
    }, 150);
}

// Инициализация
function init() {
    currentLimit = getLimitByWidth();
    isExpanded = false;
    
    renderDesktopGrid();
    renderMobileSlider();
    toggleBtn.textContent = 'Показать все';
    
    toggleBtn.addEventListener('click', onToggleClick);
    window.addEventListener('resize', onWindowResize);
    
    console.log('Инициализация завершена');
    console.log('Ширина экрана:', window.innerWidth);
    console.log('Лимит брендов:', currentLimit);
}

document.addEventListener('DOMContentLoaded', init);