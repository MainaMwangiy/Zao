export interface ProjectsProps {
    name: string;
    location: string;
    size: string;
    status: string;
    projectplan: boolean;
    imagesurl: string;
    projectid: string;
    roleid: number;
    costprojectestimation: string;
  }
  
  export  interface Organization {
    clientorganizationid: number;
    name: string;
    appconfig: {
      dateFormat?: string;
    };
    createdon: string;
    createdbyuserid: number;
    modifiedon: string;
    modifiedbyuserid: number;
    isdeleted: number;
  }
  
  export type BlobItem = {
    url: string;
    downloadUrl: string;
    pathname: string;
    size: number;
    uploadedAt: string;
  };
  
  export  type BlobsData = {
    hasMore: boolean;
    data: BlobItem[];
  };
  
  export  type ListResponse = {
    success: boolean;
    data: BlobsData;
  };

  export  interface SidebarProps {
    isOpen?: boolean,
    toggleSidebar?: () => void;
  }
  
  export interface SidebarProps {
    isMobile?: boolean;
    isOpen?: boolean;
    closeSidebar?: () => void;
  }
  