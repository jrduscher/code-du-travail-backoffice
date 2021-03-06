import React from "react";

import AdminMenu from "../AdminMenu";
import Main from "../Main";
import { Content } from "./styles";

const AdminMainLayout = ({ children, hasBareContent = false, isLoading, isScrollable = true }) => (
  <Main isHorizontal isLoading={isLoading}>
    <AdminMenu />
    {hasBareContent ? children : <Content isScrollable={isScrollable}>{children}</Content>}
  </Main>
);

export default AdminMainLayout;
