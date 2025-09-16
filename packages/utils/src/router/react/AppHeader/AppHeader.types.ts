import { BuildTabsOptions, RootRouteNode } from "../types";

export interface AppHeaderProps {
  structure: RootRouteNode[];
  appName?: string;
  info?: AppHeaderInfoProps;
  notifications?: AppHeaderNotificationsProps;
  options?: AppHeaderOptions;
}

export type AppHeaderInfoProps = {
  text: string | null;
  handleInfoClick?: any;
};

export type AppHeaderNotificationsProps = {
  notificationCount: number | null;
  handleNotificationsClick?: any;
};

export type AppHeaderOptions = {
  tabOptions?: BuildTabsOptions;
  home?: {
    path: string;
  };
  user?: {
    path: string;
    status?: "available" | "away" | "do-not-disturb" | "offline" | undefined;
  };
};
