let currentSlideIndex = 0;
let autoSlideTimer = null;

document.addEventListener('DOMContentLoaded', function() {
    showSlide(currentSlideIndex);
    startAutoSlide();
});

function changeSlide(n) {
    clearAutoSlide();
    showSlide(currentSlideIndex += n);
    startAutoSlide();
}

function currentSlide(n) {
    clearAutoSlide();
    showSlide(currentSlideIndex = n);
    startAutoSlide();
}

function showSlide(n) {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (n >= slides.length) {
        currentSlideIndex = 0;
    }
    if (n < 0) {
        currentSlideIndex = slides.length - 1;
    }

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
}

function startAutoSlide() {
    autoSlideTimer = setInterval(function() {
        currentSlideIndex++;
        showSlide(currentSlideIndex);
    }, 5000);
}

function clearAutoSlide() {
    if (autoSlideTimer) {
        clearInterval(autoSlideTimer);
    }
}
