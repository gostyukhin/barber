const swiper = new Swiper('.swiper-1', {
  loop: true,
  parallax: true,
  speed: 1500,

  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  on: {
    slideChange: function () {
      // Получаем все слайды
      const slides = document.querySelectorAll('.swiper-slide');
      const activeSlide = this.slides[this.activeIndex];

      slides.forEach(slide => {
        // Устанавливаем tabindex для каждого слайда
        const elements = slide.querySelectorAll('button, a, input, select, textarea');
        elements.forEach(el => {
          if (slide === activeSlide) {
            el.setAttribute('tabindex', '0');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });
    },
    init: function () {
      // Инициализируем tabindex при старте слайдера
      const slides = document.querySelectorAll('.swiper-slide');
      const activeSlide = this.slides[this.activeIndex];

      slides.forEach(slide => {
        const elements = slide.querySelectorAll('button, a, input, select, textarea');
        elements.forEach(el => {
          if (slide === activeSlide) {
            el.setAttribute('tabindex', '0');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });
    }
  }
});

const swiper2 = new Swiper('.swiper-2', {
  loop: true,
  slidesPerView: 3,
  spaceBetween: 18,

  pagination: {
    el: '.swiper-pagination-2',
    clickable: true,
  },
  breakpoints: {
    320: {
      slidesPerView: 1,
    },
    500: {
      slidesPerView: 2,
    },

    826: {
      slidesPerView: 3,
    }
  },
  on: {
    slideChange: function () {
      // Получаем все слайды
      const slides = document.querySelectorAll('.swiper-slide');
      const activeSlide = this.slides[this.activeIndex];

      slides.forEach(slide => {
        // Устанавливаем tabindex для каждого слайда
        const elements = slide.querySelectorAll('button, a, input, select, textarea');
        elements.forEach(el => {
          if (slide === activeSlide) {
            el.setAttribute('tabindex', '0');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });
    },
    init: function () {
      // Инициализируем tabindex при старте слайдера
      const slides = document.querySelectorAll('.swiper-slide');
      const activeSlide = this.slides[this.activeIndex];

      slides.forEach(slide => {
        const elements = slide.querySelectorAll('button, a, input, select, textarea');
        elements.forEach(el => {
          if (slide === activeSlide) {
            el.setAttribute('tabindex', '0');
          } else {
            el.setAttribute('tabindex', '-1');
          }
        });
      });
    }
  }
});


// Высота Header
const header = document.querySelector('.header');
const setHeightHeader = () => {
  const headerHeight = header.offsetHeight;
  document.documentElement.style.setProperty('--header-height', `${headerHeight}px`);
};

window.addEventListener('load', setHeightHeader);
window.addEventListener('resize', setHeightHeader);

// Tabs
const galleryTabs = document.querySelector('.gallery__tabs');
const galleryTabsNav = document.querySelector('.gallery__tabs-nav');
const galleryTabsContent = document.querySelector('.gallery__tabs-content');

const removeClass = () => {
  const prevActiveButton = galleryTabsNav.querySelector('.active');
  const prevActiveCotnetn = galleryTabsContent.querySelector('.active');
  if (prevActiveButton) {
    prevActiveButton.classList.remove('active');
    prevActiveCotnetn.classList.remove('active');
  };
};

const addClass = (currentButton) => {
  const dataBtn = currentButton.dataset.btn;
  if (!dataBtn) return;
  const currentTabContent = galleryTabsContent.querySelector(`[data-content=${dataBtn}]`);
  currentButton.classList.add('active');
  currentTabContent.classList.add('active');
};

const openTabs = (event) => {
  const currentButton = event.target;
  removeClass();
  addClass(currentButton);
};
galleryTabsNav.addEventListener('click', openTabs);


Fancybox.bind("[data-fancybox]", {
  hideScrollbar: false,
  autoDimensions: false,
});

// Mobile menu
const burgerBtn = document.querySelector('.header__button-burger');
const mobileMenu = document.querySelector('.mobile-menu');
const openMObileMenu = () => {
  burgerBtn.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.classList.toggle('scroll-lock');
};
burgerBtn.addEventListener('click', openMObileMenu);

const mobileMenuLinks = document.querySelectorAll('.mobile-menu__link');
const closeMobileMenu = () => {
  mobileMenuLinks.forEach(element => {
    element.addEventListener('click', function (event) {
      if (event.target === element) {
        burgerBtn.classList.remove('active');
        mobileMenu.classList.remove('open');
        document.body.classList.remove('scroll-lock');
      }
    })
  });
};
closeMobileMenu();

// Preloader
const preloader = document.querySelector('.preloader');
const closePreload = () => {
  setTimeout(() => {
    preloader.classList.remove('open');
    document.body.classList.remove('scroll-lock');


    AOS.init({
      duration: 800,
      once: false,
    });
  }, 2000)
};
window.addEventListener('load', closePreload);


// Убрать рользовательский focus с инпута при клике
document.body.classList.add('mouse-navigation');
window.addEventListener('keydown', (e) => {
  if (e.key === 'Tab') {
    document.body.classList.remove('mouse-navigation');
  }
});

window.addEventListener('mousedown', () => {
  document.body.classList.add('mouse-navigation');
});