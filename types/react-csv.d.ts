declare module 'react-csv' {
  import { ComponentType, ReactNode } from 'react';

  export interface CSVLinkProps {
    data: any[] | string;
    headers?: any[];
    target?: string;
    separator?: string;
    filename?: string;
    uFEFF?: boolean;
    enclosingCharacter?: string;
    className?: string;
    children?: ReactNode;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
    asyncOnClick?: boolean;
  }

  export const CSVLink: ComponentType<CSVLinkProps>;

  export interface CSVDownloadProps {
    data: any[] | string;
    headers?: any[];
    target?: string;
    separator?: string;
    filename?: string;
    uFEFF?: boolean;
    enclosingCharacter?: string;
  }

  export const CSVDownload: ComponentType<CSVDownloadProps>;
}
