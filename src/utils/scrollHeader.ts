function watchAndScrollHeader() {
  let initScrollY = 0;
  let translateY = 0;
  let animationFrame = 0;
  const header = document.querySelector('.mcHeader') as HTMLElement;
  const headerHeight = header.clientHeight;

  document.addEventListener('scroll', () => {
    let tempDocTop = window.pageYOffset || document.documentElement.scrollTop;
    if (tempDocTop > initScrollY && tempDocTop >= headerHeight) {
      translateY = 0 - headerHeight;
    } else {
      translateY = 0;
    }

    if (animationFrame) {
      window.cancelAnimationFrame(animationFrame);
    }
    animationFrame = requestAnimationFrame(() => {
      header.style.cssText = `transform: translateY(${translateY}px); transition: transform 0.5s`;
      initScrollY = tempDocTop;
    });
  });
}

export { watchAndScrollHeader };
