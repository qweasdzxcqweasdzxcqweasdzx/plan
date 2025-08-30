// Презентация - JavaScript для навигации
class Presentation {
    constructor() {
        this.currentSlide = 0;
        this.slides = document.querySelectorAll('.slide');
        this.totalSlides = this.slides.length; // Теперь будет 13 слайдов
        this.isAnimating = false;
        
        this.init();
    }
    
    init() {
        // Инициализация событий
        this.bindEvents();
        
        // Инициализация мобильной навигации
        this.initMobileNavigation();
        
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
        
        // Свайпы на мобильных устройствах с улучшенной обработкой
        let startX = 0;
        let startY = 0;
        let isVerticalScroll = false;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isVerticalScroll = false;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            if (!startX || !startY) return;
            
            const diffX = startX - e.touches[0].clientX;
            const diffY = startY - e.touches[0].clientY;
            
            // Определяем направление свайпа
            if (Math.abs(diffY) > Math.abs(diffX)) {
                isVerticalScroll = true;
            }
            
            // Предотвращаем скролл только для горизонтальных свайпов
            if (!isVerticalScroll && Math.abs(diffX) > 30) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('touchend', (e) => {
            if (this.isAnimating) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const diffX = startX - endX;
            const diffY = startY - endY;
            
            // Проверяем, что это горизонтальный свайп с достаточной длиной
            if (!isVerticalScroll && Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 80) {
                if (diffX > 0) {
                    this.nextSlide();
                } else {
                    this.previousSlide();
                }
            }
            
            // Сброс значений
            startX = 0;
            startY = 0;
            isVerticalScroll = false;
        }, { passive: true });
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
                // Обновляем индикатор мобильной навигации
                this.updateSlideIndicator();
            }, 800);
        }, 50);
    }
    
    nextSlide() {
        const nextIndex = (this.currentSlide + 1) % this.totalSlides;
        this.showSlide(nextIndex);
        // Вибрация для мобильных устройств
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
    }
    
    previousSlide() {
        const prevIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.showSlide(prevIndex);
        // Вибрация для мобильных устройств
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }
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
    
    initMobileNavigation() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => {
                if (!this.isAnimating) this.previousSlide();
            });
            
            nextBtn.addEventListener('click', () => {
                if (!this.isAnimating) this.nextSlide();
            });
        }
        
        // Обновляем индикатор
        this.updateSlideIndicator();
    }
    
    updateSlideIndicator() {
        const currentSlideElement = document.getElementById('currentSlide');
        if (currentSlideElement) {
            currentSlideElement.textContent = this.currentSlide + 1;
        }
        
        // Обновляем состояние кнопок
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.disabled = this.currentSlide === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentSlide === this.totalSlides - 1;
        }
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
        <div class="loading-indicator" style="
            color: white;
            font-size: 1.2rem;
            font-weight: 300;
            animation: pulse 2s ease-in-out infinite;
            text-align: center;
            max-width: 80%;
        ">
            <div style="font-size: 3rem; margin-bottom: 20px;">🌱</div>
            <div style="margin-bottom: 10px;">Загрузка презентации...</div>
            <div style="font-size: 0.9rem; opacity: 0.8;">Оптимизация для мобильных устройств...</div>
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
        <div>👆 Свайпы влево/вправо</div>
        <div>← → стрелки</div>
        <div>🖱️ колесико мыши</div>
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

// Мобильная подсказка о свайпах
if (window.innerWidth <= 768) {
    setTimeout(() => {
        const mobileHint = document.createElement('div');
        mobileHint.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(46, 125, 50, 0.95);
            backdrop-filter: blur(15px);
            color: white;
            padding: 25px 30px;
            border-radius: 20px;
            font-size: 18px;
            text-align: center;
            z-index: 2000;
            opacity: 0;
            transition: opacity 0.5s ease;
            border: 2px solid rgba(129, 199, 132, 0.4);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
            max-width: 90%;
        `;
        
        mobileHint.innerHTML = `
            <div style="font-size: 2.5rem; margin-bottom: 15px;">👆</div>
            <div style="font-weight: 600; margin-bottom: 10px; color: #90EE90;">Проведите пальцем</div>
            <div style="margin-bottom: 15px;">влево или вправо</div>
            <div style="font-size: 14px; opacity: 0.8;">для переключения слайдов</div>
        `;
        
        document.body.appendChild(mobileHint);
        
        // Показываем подсказку
        setTimeout(() => {
            mobileHint.style.opacity = '1';
        }, 100);
        
        // Скрываем по клику или через 5 секунд
        const hideMobileHint = () => {
            mobileHint.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(mobileHint)) {
                    document.body.removeChild(mobileHint);
                }
            }, 500);
        };
        
        mobileHint.addEventListener('click', hideMobileHint);
        setTimeout(hideMobileHint, 5000);
    }, 3000);
}

// Обработка изменения размера окна
window.addEventListener('resize', () => {
    // Пересчитываем позиции элементов при изменении размера
    const elements = document.querySelectorAll('.element');
    elements.forEach(element => {
        element.style.transform = 'translate(0, 0)';
    });
});
