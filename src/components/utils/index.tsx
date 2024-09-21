const utils = {
  isMobile: window.matchMedia("(max-width: 767px)").matches,
  isTablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches,
  isDesktop: window.matchMedia("(min-width: 1025px)").matches,
  baseUrl: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL,
};

export default utils;
