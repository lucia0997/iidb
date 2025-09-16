import React, { MouseEvent, useState } from "react";
import {
  Tab,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  MenuDivider,
  Badge,
} from "@airbus/components-react";
import { ExpandLess, ExpandMore } from "@airbus/icons/react";
import {
  HeaderTabProps,
  HeaderTabsProps,
  NotificationBadgeProps,
} from "./types";
import { ProtectedContent } from "../../authorization/react";

export function EndTab({ tab, navigate }: HeaderTabProps) {
  return (
    <Tab
      className="ds-tab7--negative"
      style={{ paddingLeft: "0", paddingRight: "0" }}
      tabIndex={0}
      key={tab.tabName}
      label={tab.tabName}
    >
      <Button
        style={{ background: "transparent" }}
        variant="ghostNegative"
        onClick={() => navigate(tab.path ?? "/404")}
      >
        {tab.tabName}
      </Button>
    </Tab>
  );
}

export function ClickableTab({ tab, navigate }: HeaderTabProps) {
  return (
    <Tab
      className="ds-tab7--negative"
      style={{ paddingLeft: "0", paddingRight: "0" }}
      key={tab.tabName}
      label={tab.tabName}
      icon={
        <Menu>
          <MenuButton
            style={{
              background: "transparent",
              border: "none",
              padding: "calc(0.5rem - 1px) 0.5rem",
            }}
            variant="ghostNegative"
          >
            <div style={{ paddingTop: "0.5rem", width: "0.25rem" }}>
              <ExpandMore />
            </div>
          </MenuButton>
          <MenuList>
            <TabList tabs={tab.children ?? []} navigate={navigate} />
          </MenuList>
        </Menu>
      }
    >
      <Button
        style={{
          paddingLeft: "0",
          background: "transparent",
        }}
        variant="ghostNegative"
        onClick={() => navigate("/user3")}
      >
        {tab.tabName}
      </Button>
    </Tab>
  );
}

export function GroupTab({ tab, navigate }: HeaderTabProps) {
  return (
    <Tab
      className="ds-tab7--negative"
      style={{
        paddingLeft: "0.25rem",
        paddingRight: "0.25rem",
      }}
      key={tab.tabName}
      label={tab.tabName}
    >
      <Menu>
        <MenuButton
          style={{
            background: "transparent",
            border: "none",
            color: "inherit",
            padding: "calc(0.5rem - 1px) 0.5rem",
          }}
          variant="ghostNegative"
        >
          <div
            style={{
              paddingLeft: "0",
              paddingTop: "0.5rem",
              width: "18px",
            }}
          >
            <ExpandMore />
          </div>
          <div style={{ fontWeight: "normal" }}>{tab.tabName}</div>
        </MenuButton>
        <MenuList>
          <TabList tabs={tab.children ?? []} navigate={navigate} />
        </MenuList>
      </Menu>
    </Tab>
  );
}

export function TabList({ tabs, navigate }: HeaderTabsProps) {
  const [expandedTab, setExpandedTab] = useState<number | null>(null);
  return tabs.map((item, i) => {
    const hasChildren = !!item.children?.length;
    const isPage = item.kind === "page";
    const isExpanded = expandedTab === i;

    const handleExpand = (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      setExpandedTab(isExpanded ? null : i);
    };

    return (
      <ProtectedContent permissions={item.requiredPermissions}>
        <MenuItem
          key={item.tabName}
          label={item.tabName}
          style={{
            padding: "8px 1rem",
            background: isExpanded ? "#EEEEEE" : undefined,
          }}
          onClick={isPage ? () => navigate(item.path ?? "/404") : undefined}
          icon={
            hasChildren ? (
              <IconButton
                style={{
                  padding: "0 0",
                }}
                onClick={handleExpand}
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            ) : undefined
          }
        >
          <div
            style={{
              padding: "4px 0",
              textAlign: "right",
              fontWeight: isPage ? "bold" : "inherit",
            }}
          >
            {item.tabName}
          </div>
        </MenuItem>
        {hasChildren && isExpanded && (
          <>
            <MenuDivider />
            {item.children?.map((subitem) => {
              return (
                <ProtectedContent permissions={subitem.requiredPermissions}>
                  <MenuItem
                    key={subitem.tabName}
                    label={subitem.tabName}
                    style={{
                      padding: "4px 1rem",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                    onClick={() => navigate(subitem.path ?? "/404")}
                  >
                    {subitem.tabName}
                  </MenuItem>
                </ProtectedContent>
              );
            })}
          </>
        )}
      </ProtectedContent>
    );
  });
}

export function NotificationBadge({
  children,
  notifications,
}: NotificationBadgeProps) {
  if (!notifications || !notifications.notificationCount)
    return <>{children}</>;
  return (
    <Badge
      count={notifications?.notificationCount ?? undefined}
      onClick={notifications?.handleNotificationsClick}
      variant="error"
      placement="topleft"
      offset={[0, 10]}
    >
      {children}
    </Badge>
  );
}
