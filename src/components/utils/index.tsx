const utils = {
    isMobile: window.matchMedia("(max-width: 767px)").matches,
    isTablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches,
    isDesktop: window.matchMedia("(min-width: 1025px)").matches,
  };
  
  export default utils;
  