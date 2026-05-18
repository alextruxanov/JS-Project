// СПИСОК БРЕНДОВ
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

let isExpanded = false;
let currentVisibleCount = 4;
let resizeTimeout;

const desktopGrid = document.getElementById('desktopBrandsGrid');
const sliderTrack = document.getElementById('sliderTrack');
const toggleBtn = document.getElementById('toggleBtn');

function getVisibleCountByWidth() {
    const width = window.innerWidth;
    if (width <= 320) return 1;
    if (width <= 768) return 6;
    if (width <= 1120) return 8;
    return 11;
}

function getArrowSVG() {
    return `<svg xmlns="http://www.w3.org/2000/svg" width="10" height="14" viewBox="0 0 7 12" fill="none">
        <path d="M1 1L6 6L1 11" stroke="#e31e24" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`;
}

function createBrandElement(brand, isDesktop = true) {
    const container = document.createElement(isDesktop ? 'a' : 'div');
    container.className = isDesktop ? 'brand-link' : 'slider-item';
    if (isDesktop) container.href = '#';
    
    const leftPart = document.createElement('span');
    leftPart.className = isDesktop ? 'brand-content' : 'slider-item-content';
    
    const img = document.createElement('img');
    img.src = brand.img;
    img.alt = brand.name;
    img.className = isDesktop ? 'brand-icon' : 'brand-icon-mobile';
    img.onerror = () => { img.style.display = 'none'; };
    
    const text = document.createTextNode(brand.name);
    leftPart.appendChild(img);
    leftPart.appendChild(text);
    
    const arrow = document.createElement('span');
    arrow.className = isDesktop ? 'brand-arrow' : 'slider-arrow';
    arrow.innerHTML = getArrowSVG();
    
    container.appendChild(leftPart);
    container.appendChild(arrow);
    
    container.addEventListener('click', (e) => {
        if (isDesktop) e.preventDefault();
        console.log(`Выбран бренд: ${brand.name}`);
    });
    
    return container;
}

// Отрисовка десктопной сетки
function renderDesktopGrid() {
    if (!desktopGrid) return;
    desktopGrid.innerHTML = '';
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentVisibleCount;
    
    fullBrandsList.forEach((brand, index) => {
        const element = createBrandElement(brand, true);
        if (!isExpanded && index >= visibleCount) {
            element.classList.add('hidden-item');
        }
        desktopGrid.appendChild(element);
    });
}

// Отрисовка мобильного слайдера
function renderMobileSlider() {
    if (!sliderTrack) return;
    sliderTrack.innerHTML = '';
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentVisibleCount;
    const brandsToShow = fullBrandsList.slice(0, visibleCount);
    
    brandsToShow.forEach((brand) => {
        const slide = createBrandElement(brand, false);
        sliderTrack.appendChild(slide);
    });
    
    if (sliderTrack) sliderTrack.scrollLeft = 0;
}

// Оптимизированное обновление без мигания
function updateUI() {
    toggleBtn.textContent = isExpanded ? 'Скрыть' : 'Показать все';
    
    const visibleCount = isExpanded ? fullBrandsList.length : currentVisibleCount;
    
    // Обновляем без перерисовки, только меняем классы
    if (desktopGrid && window.innerWidth > 768) {
        const items = desktopGrid.querySelectorAll('.brand-link');
        items.forEach((item, idx) => {
            if (!isExpanded && idx >= visibleCount) {
                item.classList.add('hidden-item');
            } else {
                item.classList.remove('hidden-item');
            }
        });
    } else if (window.innerWidth <= 768) {
        renderMobileSlider();
    }
}

function onToggle() {
    isExpanded = !isExpanded;
    updateUI();
}

// Оптимизированный обработчик ресайза (без мигания)
function handleResize() {
    clearTimeout(resizeTimeout);
    
    resizeTimeout = setTimeout(() => {
        const newVisibleCount = getVisibleCountByWidth();
        
        if (newVisibleCount !== currentVisibleCount && !isExpanded) {
            currentVisibleCount = newVisibleCount;
            
            // Обновляем только видимость без полной перерисовки
            if (desktopGrid && window.innerWidth > 768) {
                const items = desktopGrid.querySelectorAll('.brand-link');
                items.forEach((item, idx) => {
                    if (idx >= currentVisibleCount) {
                        item.classList.add('hidden-item');
                    } else {
                        item.classList.remove('hidden-item');
                    }
                });
            } else if (window.innerWidth <= 768) {
                renderMobileSlider();
            }
        }
    }, 100);
}

// Инициализация
function init() {
    isExpanded = false;
    currentVisibleCount = getVisibleCountByWidth();
    
    renderDesktopGrid();
    renderMobileSlider();
    toggleBtn.textContent = 'Показать все';
    
    toggleBtn.addEventListener('click', onToggle);
    window.addEventListener('resize', handleResize);
}

document.addEventListener('DOMContentLoaded', init);