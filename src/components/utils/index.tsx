interface UserData {
  name: string;
  email: string;
  roleid: number
  farmerOrBuyer: string;
  location: string;
  status: "Active" | "Inactive";
  role: string;
}
const utils = {
  isMobile: window.matchMedia("(max-width: 767px)").matches,
  isTablet: window.matchMedia("(min-width: 768px) and (max-width: 1024px)").matches,
  isDesktop: window.matchMedia("(min-width: 1025px)").matches,
  baseUrl: process.env.NODE_ENV === 'production' ? process.env.REACT_APP_PROD_BACKEND_URL : process.env.REACT_APP_DEV_BACKEND_URL,
  getRoles: (roleId: number): 'SuperAdmin' | 'Admin' | 'User' | undefined => {
    switch (roleId) {
      case 1:
        return 'SuperAdmin';
      case 2:
        return 'Admin';
      case 3:
        return 'User';
      default:
        break;
    }
  },
  updateData: (data: UserData[]): UserData[] => {
    return data.map((dt) => ({
      ...dt,
      role: utils.getRoles(dt.roleid) || "User"
    }));
  }
};

export default utils;
