import {
  RootRouteNode,
  FlattenRoute,
  BuildTabsOptions,
  RouteNode,
  TabElement,
  PageDepth,
  Page,
  TabGroup,
} from "./types";

const trimPath = (path: string) => path.replace(/^\/+|\/+$/g, "");

function joinPaths(base: string, relative: string): string {
  return "/" + trimPath(base) + "/" + trimPath(relative);
}

function matchPaths(path: string, pattern: string): boolean {
  const pathA = trimPath(path);
  const pathB = trimPath(pattern);

  if (pathA === "" || pathB === "") return pathA === pathB;

  const pathPartsA = pathA.split("/");
  const pathPartsB = pathB.split("/");
  if (pathPartsA.length !== pathPartsB.length) return false;

  for (let i = 0; i < pathPartsA.length; i++) {
    if (pathPartsB[i].startsWith(":")) {
      if (pathPartsA[i].length === 0) return false; // path pattern with :id can be replaced with everithing
      continue;
    }
    if (pathPartsB[i] !== pathPartsA[i]) return false;
  }
  return true;
}

export function flattenRoutes(
  nodes: RootRouteNode[],
  base: string = ""
): FlattenRoute[] {
  const paths: FlattenRoute[] = [];

  for (const node of nodes) {
    if (node.kind !== "tabGroup") {
      const relative = joinPaths(base, node.path);
      paths.push(...flattenRoutes((node.children ?? []) as any, relative));
      if (node.kind !== "routeGroup") {
        const full = joinPaths(base, node.path);
        paths.push({ node: node, pattern: full });
      }
    }
  }
  return paths;
}

export function extractTabs(
  nodes: RouteNode<PageDepth>[],
  depth: number = 2,
  hasPermision: (perm: string) => boolean,
  options?: BuildTabsOptions
): TabElement[] {
  const sortByOrder = options?.sorByOrder ?? true;
  if (depth < 0) return [];
  const filteredTabs: (Page<PageDepth> | TabGroup<PageDepth>)[] = nodes.filter(
    (
      node
    ): node is Extract<RouteNode<PageDepth>, { kind: "page" | "tabGroup" }> =>
      node.kind === "page" || node.kind === "tabGroup"
  );

  const tabs: TabElement[] = filteredTabs
    .filter(
      (node) =>
        !node.requiredPermissions ||
        node.requiredPermissions?.every((perm) => hasPermision(perm))
    )
    .sort(sortByOrder ? orderTabs : () => 0)
    .map<TabElement>((node) => {
      return {
        kind: node.kind,
        tabName: node.tabName,
        tabOrder: node.tabOrder,
        path: node.kind === "page" ? node.path : undefined,
        children: node.children
          ? extractTabs(node.children, depth - 1, hasPermision, options)
          : undefined,
      };
    });

  const maxSize = options?.maxGroupSize
    ? options?.maxGroupSize[depth] ?? null
    : null;

  return tabs.slice(0, maxSize ?? tabs.length);
}

export function orderTabs(
  a: Page<PageDepth> | TabGroup<PageDepth>,
  b: Page<PageDepth> | TabGroup<PageDepth>
): number {
  if (a.tabOrder && b.tabOrder && a.tabOrder !== b.tabOrder)
    return a.tabOrder - b.tabOrder;
  if (b.tabOrder && !b.tabOrder) return -1;
  return 0;
}

export function selectElementByPath(
  nodes: FlattenRoute[],
  path: string
): FlattenRoute | null {
  const matches = nodes.filter((node) => matchPaths(path, node.pattern));
  if (!matches.length) return null;
  matches.sort((a, b) => b.pattern.length - a.pattern.length);
  return matches[0];
}
