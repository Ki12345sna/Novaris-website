document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. ACTIVE CENTERED CAROUSEL
     ========================================================================== */
  const track = document.getElementById('sliderTrack');
  const prevBtn = document.getElementById('slidePrev');
  const nextBtn = document.getElementById('slideNext');
  const slides = Array.from(track.children);
  
  let currentIndex = 1; // Start with the second slide (Eclipse House) as active
  let isDragging = false;
  let startX = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let animationID = 0;
  
  // Set active class and center the current index
  function updateCarousel() {
    slides.forEach((slide, index) => {
      if (index === currentIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    const wrapper = track.parentElement;
    const wrapperWidth = wrapper.getBoundingClientRect().width;
    const slideWidth = slides[0].getBoundingClientRect().width;
    const gap = 24; // matches CSS gap
    
    // Calculate translation to center the current active slide
    const centerOffset = (wrapperWidth / 2) - (slideWidth / 2);
    const translateAmount = centerOffset - (currentIndex * (slideWidth + gap));
    
    track.style.transform = `translateX(${translateAmount}px)`;
    prevTranslate = translateAmount;
  }

  // Prev / Next button listeners
  prevBtn.addEventListener('click', () => {
    if (currentIndex > 0) {
      currentIndex--;
      updateCarousel();
    }
  });

  nextBtn.addEventListener('click', () => {
    if (currentIndex < slides.length - 1) {
      currentIndex++;
      updateCarousel();
    }
  });

  // Handle responsiveness on resize
  window.addEventListener('resize', updateCarousel);

  /* DRAG / SWIPE SUPPORT */
  const wrapper = track.parentElement;

  wrapper.addEventListener('mousedown', dragStart);
  wrapper.addEventListener('touchstart', dragStart, { passive: true });
  
  wrapper.addEventListener('mouseup', dragEnd);
  wrapper.addEventListener('mouseleave', dragEnd);
  wrapper.addEventListener('touchend', dragEnd);
  
  wrapper.addEventListener('mousemove', dragAction);
  wrapper.addEventListener('touchmove', dragAction, { passive: true });

  function dragStart(e) {
    isDragging = true;
    startX = getPositionX(e);
    track.style.transition = 'none'; // Disable transition during drag
    animationID = requestAnimationFrame(animation);
  }

  function dragAction(e) {
    if (!isDragging) return;
    const currentX = getPositionX(e);
    const diff = currentX - startX;
    currentTranslate = prevTranslate + diff;
  }

  function dragEnd() {
    if (!isDragging) return;
    isDragging = false;
    cancelAnimationFrame(animationID);
    
    track.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    
    // Calculate shift to see if we should snap to prev/next
    const slideWidth = slides[0].getBoundingClientRect().width + 24;
    const movedBy = currentTranslate - prevTranslate;
    
    if (movedBy < -100 && currentIndex < slides.length - 1) {
      currentIndex++;
    } else if (movedBy > 100 && currentIndex > 0) {
      currentIndex--;
    }
    
    updateCarousel();
  }

  function getPositionX(e) {
    return e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
  }

  function animation() {
    if (isDragging) {
      track.style.transform = `translateX(${currentTranslate}px)`;
      requestAnimationFrame(animation);
    }
  }

  // Initialize carousel on load
  setTimeout(updateCarousel, 100);


  /* ==========================================================================
     2. NAVIGATION LINK HIGHLIGHT ON SCROLL
     ========================================================================== */
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let currentSectionId = 'home';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  });

});
