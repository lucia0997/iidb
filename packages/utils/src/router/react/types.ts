import React from "react";
import { NavigateFunction } from "react-router-dom";
import { AppHeaderNotificationsProps } from "./AppHeader";

// Decremental depth map for defining the maximum Page depth
type PageDepthMap = { 2: 1; 1: 0; 0: never };

export type PageDepth = Extract<keyof PageDepthMap, number>; // 0|1|2
type Dec<D extends PageDepth> = PageDepthMap[D]; // 2->1, 1->0, 0->never

interface PageProtection {
  requiredPermissions?: string[];
}

export interface BasePageProps<D extends PageDepth> extends PageProtection {
  key: string;
  title?: string;
  description?: string;
  isPublic?: boolean;
  children?: D extends 0 ? never : RouteNode<Dec<D>>[];
}

export interface RouteProps {
  path: string;
  index?: boolean;
}

export interface TabProps {
  tabName: string;
  tabOrder?: number;
}

export interface PageNodeProps extends RouteProps {
  element: React.ReactNode;
}

export interface Page<D extends PageDepth>
  extends BasePageProps<D>,
    TabProps,
    PageNodeProps {
  readonly kind: "page";
}

export interface RoutePage<D extends PageDepth>
  extends BasePageProps<D>,
    PageNodeProps {
  readonly kind: "route";
}

export interface RouteGroup<D extends PageDepth>
  extends BasePageProps<D>,
    RouteProps {
  readonly kind: "routeGroup";
}

export interface TabGroup<D extends PageDepth>
  extends BasePageProps<D>,
    TabProps {
  readonly kind: "tabGroup";
}

export type RouteNode<D extends PageDepth> =
  | Page<D>
  | RoutePage<D>
  | RouteGroup<D>
  | TabGroup<D>;

export type RouteRenderNode<D extends PageDepth> = Page<D> | RoutePage<D>;

export type RootRouteNode = RouteNode<2>;

export type FlattenRoute = {
  pattern: string;
  node: Page<never> | RoutePage<never>;
};

export interface TabElement extends TabProps, PageProtection {
  kind: "page" | "tabGroup";
  path?: string;
  children?: TabElement[];
}

export type TabLevelSizeLimits = Partial<Record<number, number>>;

export type BuildTabsOptions = {
  maxGroupSize?: TabLevelSizeLimits;
  sorByOrder?: boolean;
};

export interface HeaderTabProps {
  tab: TabElement;
  navigate: NavigateFunction;
}

export interface HeaderTabsProps {
  tabs: TabElement[];
  navigate: NavigateFunction;
}

export interface NotificationBadgeProps {
  children: React.ReactNode;
  notifications?: AppHeaderNotificationsProps;
}
