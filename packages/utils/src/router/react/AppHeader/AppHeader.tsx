import {
  Header,
  Tabs,
  Badge,
  Avatar,
  Typography,
} from "@airbus/components-react";
import { AppHeaderProps } from "./AppHeader.types";
import { useNavigate } from "react-router-dom";
import { TabElement } from "../types";
import { extractTabs } from "../routerTools";
import { useAuth } from "../../../authentication/react";
import {
  ClickableTab,
  EndTab,
  GroupTab,
  NotificationBadge,
} from "../HeaderComponents";
import { ProtectedContent } from "../../../authorization/react";

export default function AppHeader({
  structure,
  appName,
  info,
  notifications,
  options,
}: AppHeaderProps) {
  const navigate = useNavigate();
  const { hasPermission, user } = useAuth();
  const tabStruct: TabElement[] = extractTabs(structure, 2, hasPermission, {
    maxGroupSize: options?.tabOptions?.maxGroupSize ?? { 2: 4, 1: 6, 0: 6 },
    sorByOrder: options?.tabOptions?.sorByOrder ?? true,
  });

  return (
    <Header
      appName={appName}
      onHomeClick={() => navigate(options?.home?.path ?? "/")}
    >
      <Tabs>
        {tabStruct.map((tab) => {
          if (tab.kind === "tabGroup") {
            return (
              <ProtectedContent permissions={tab.requiredPermissions}>
                <GroupTab tab={tab} navigate={navigate} />
              </ProtectedContent>
            );
          }
          if (!tab.children?.length) {
            return (
              <ProtectedContent permissions={tab.requiredPermissions}>
                <EndTab tab={tab} navigate={navigate} />
              </ProtectedContent>
            );
          } else {
            return (
              <ProtectedContent permissions={tab.requiredPermissions}>
                <ClickableTab tab={tab} navigate={navigate} />
              </ProtectedContent>
            );
          }
        })}
      </Tabs>
      <div style={{ width: "10px" }} />
      <NotificationBadge notifications={notifications}>
        <Avatar
          style={{ cursor: "pointer" }}
          size="medium"
          onClick={() => navigate(options?.user?.path ?? "/user")}
          status={options?.user?.status}
        />
      </NotificationBadge>

      <div>
        <Typography style={{ fontWeight: "bold", color: "white" }}>
          {user?.fullName ?? user?.username ?? "User not found"}
        </Typography>
        <Typography
          variant="small"
          style={{ color: "white", cursor: "pointer" }}
          onClick={info?.handleInfoClick}
        >
          {info?.text}
        </Typography>
      </div>
    </Header>
  );
}

/* 
Terminar códigos de tools de headers
Pendiente definir el tab, las distintas capas, link a inicio, etc 
pagina de login
pagina de user
pagina de admin
hacer el popup service
definir estandar de errores para backend (+ forms)
pagina de errores frontend
forms
*/
