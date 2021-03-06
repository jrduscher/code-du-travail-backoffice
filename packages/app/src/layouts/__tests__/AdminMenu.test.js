import { fireEvent, render } from "@testing-library/react";
import React from "react";

import AdminMenu from "../AdminMenu";

describe.skip("[Contrib] layouts/<AdminMenu />", () => {
  // https://github.com/facebook/jest/issues/890#issuecomment-415202799
  window.history.pushState({}, "", "/admin");

  const { asFragment, container, getByText } = render(<AdminMenu />);
  const firstRender = asFragment();

  it("should match snapshot", () => {
    expect(container).toMatchSnapshot();
  });

  it("should redirect to the expected path", () => {
    fireEvent.click(getByText("Tableau de bord"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin");
  });

  it("should redirect to the agreements path", () => {
    fireEvent.click(getByText("Conventions"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/agreements");
  });

  it("should redirect to the tags path", () => {
    fireEvent.click(getByText("Étiquettes"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/tags");
  });

  it("should redirect to the tags categories path", () => {
    fireEvent.click(getByText("└ Catégories"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/tags-categories");
  });

  it("should redirect to the questions path", () => {
    fireEvent.click(getByText("Questions"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/questions");
  });

  it("should redirect to the answers path", () => {
    fireEvent.click(getByText("Réponses"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/answers");
  });

  it("should redirect to the generic answers path", () => {
    fireEvent.click(getByText("Réponses génériques"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/generic-answers");
  });

  it("should redirect to the locations path", () => {
    fireEvent.click(getByText("Unités"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/locations");
  });

  it("should redirect to the users path", () => {
    fireEvent.click(getByText("Utilisateurs"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/users");
  });

  it("should redirect to the areas path", () => {
    fireEvent.click(getByText("Zones"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/areas");
  });

  it("should redirect to the migrations path", () => {
    fireEvent.click(getByText("Migrations"));

    expect(global.nextRouter.push).toHaveBeenCalledWith("/admin/migrations");
  });

  it("should match snapshot diff when the path has changed", () => {
    window.history.pushState({}, "", "/admin/agreements");

    const { asFragment } = render(<AdminMenu />);

    expect(firstRender).toMatchDiffSnapshot(asFragment());
  });
});
