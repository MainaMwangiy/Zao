interface UserData {
  name: string;
  email: string;
  roleid: number
  farmerOrBuyer: string;
  location: string;
  status: "Active" | "Inactive";
  role: string;
  clientuserid: string | number | undefined;
}

interface Users {
  lookupid: string;
  displayValue: string;
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
  getRolesId: (role: string): number | undefined => {
    const srole = role.toLowerCase();
    switch (srole) {
      case 'superadmin':
        return 1;
      case 'admin':
        return 2;
      case 'user':
        return 3;
      default:
        break;
    }
  },
  updateData: (data: UserData[]): UserData[] => {
    return data.map((dt) => ({
      ...dt,
      role: utils.getRoles(dt.roleid) || "User",
      clientuserid: dt.clientuserid || "",
    }));
  },
  getClientUsersList: (): Users[] => {
    const clientUsersFromStorage = localStorage.getItem("users");
    if (clientUsersFromStorage) {
      const parsedUsers = JSON.parse(clientUsersFromStorage);
      return parsedUsers.map((user: { clientuserid: number; name: string }) => ({
        lookupId: user.clientuserid.toString(),
        displayValue: user.name,
      }));
    }
    return [];
  }
};

export default utils;
