import React, { ReactNode } from "react";
import { authConnector, AuthProps } from "store/AuthRecucer";
import { getCookie } from "typescript-cookie";

interface Props {
  children?: ReactNode[];
}
const UserProvider: React.FC<Props & AuthProps> = ({ children, logIn }) => {
  const username = getCookie("username");
  if (username) {
    logIn(username);
  }

  return <>{children}</>;
};

export default authConnector(UserProvider);
