// Презентация - JavaScript для навигации
class Presentation {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length;
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Инициализация событий
        this.bindEvents();
        
        // Показать первый слайд
        this.showSlide(0);
        
        // Автозапуск анимаций
        this.startAnimations();
    }
    
    bindEvents() {
        // Клавиатурная навигация
        document.addEventListener('keydown', (e) => {
            if (this.isAnimating) return;
            
            switch(e.key) {
                case 'ArrowLeft':
                case 'ArrowUp':
                    e.preventDefault();
                    this.previousSlide();
                    break;
                case 'ArrowRight':
                case 'ArrowDown':
                case ' ': // Пробел
                    e.preventDefault();
                    this.nextSlide();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSlide(this.totalSlides - 1);
                    break;
            }
        });
        
        // Колесо мыши
        let wheelTimeout;
        document.addEventListener('wheel', (e) => {
            if (this.isAnimating) return;
            
            e.preventDefault();
            clearTimeout(wheelTimeout);
            wheelTimeout = setTimeout(() => {
                if (e.deltaY > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }, 50);
        }, { passive: false });
        
        // Свайпы на мобильных устройствах
        let startX = 0;
        let startY = 0;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });
        
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Проверяем, что это горизонтальный свайп
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
        });
    }
    
    showSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.isAnimating = true;
        
        // Убираем активный класс с текущего слайда
        this.slides[this.currentSlide].classList.remove('active');
        
        // Обновляем индекс
        this.currentSlide = index;
        
        // Добавляем активный класс новому слайду
        setTimeout(() => {
            this.slides[this.currentSlide].classList.add('active');
            
            // Запускаем анимации для нового слайда
            this.animateSlideContent();
            
            setTimeout(() => {
                this.isAnimating = false;
            }, 800);
        }, 50);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
    }
    
    goToSlide(index) {
        if (index >= 0 && index < this.totalSlides) {
            this.showSlide(index);
        }
    }
    
    animateSlideContent() {
        const currentSlideElement = this.slides[this.currentSlide];
        const elements = currentSlideElement.querySelectorAll('.card-base, .photo-card, .responsibility-item, .training-card, .event-card, .month-event, .training-category, .info-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }
    
    startAnimations() {
        // Анимация плавающих элементов
        const floatingElements = document.querySelectorAll('.element');
        floatingElements.forEach((element, index) => {
            element.style.animationDelay = `${index * 0.5}s`;
        });
        
        // Анимация появления контента первого слайда
        setTimeout(() => {
            this.animateSlideContent();
        }, 500);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new Presentation();
    
    // Добавляем индикатор загрузки
    const loader = document.createElement('div');
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #6b8e23 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        transition: opacity 0.5s ease;
    `;
    
    loader.innerHTML = `
        <div style="
            color: white;
            font-size: 1.5rem;
            font-weight: 300;
            animation: pulse 2s ease-in-out infinite;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 20px;">🌱</div>
            Загрузка презентации...
        </div>
    `;
    
    document.body.appendChild(loader);
    
    // Убираем загрузчик через 1.5 секунды
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(loader);
        }, 500);
    }, 1500);
});

// CSS анимации через JavaScript
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { opacity: 1; transform: scale(1); }
        50% { opacity: 0.7; transform: scale(1.05); }
    }
`;
document.head.appendChild(style);

// Показываем подсказку по управлению
setTimeout(() => {
    const hint = document.createElement('div');
    hint.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(45, 90, 39, 0.9);
        backdrop-filter: blur(10px);
        color: white;
        padding: 15px 20px;
        border-radius: 15px;
        font-size: 14px;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.5s ease;
        border: 1px solid rgba(144, 238, 144, 0.3);
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
    `;
    
    hint.innerHTML = `
        <div style="font-weight: 600; margin-bottom: 8px; color: #90EE90;">Управление:</div>
        <div>← → стрелки</div>
        <div>🖱️ колесико мыши</div>
        <div>📱 свайпы</div>
        <div>Пробел - следующий слайд</div>
    `;
    
    document.body.appendChild(hint);
    
    // Показываем подсказку
    setTimeout(() => {
        hint.style.opacity = '1';
    }, 100);
    
    // Скрываем через 6 секунд
    setTimeout(() => {
        hint.style.opacity = '0';
        setTimeout(() => {
            document.body.removeChild(hint);
        }, 500);
    }, 6000);
}, 2500);

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Пересчитываем позиции элементов при изменении размера
    const elements = document.querySelectorAll('.element');
    elements.forEach(element => {
        element.style.transform = 'translate(0, 0)';
    });
});