import Router from "next/router";
import React from "react";

import Marianne from "../../svgs/Marianne";
import Menu from "../Menu";
import cache from "../../cache";

import styles, { Brand } from "./styles";

export default class Header extends React.PureComponent {
  goToHome() {
    const me = cache.get("me");

    Router.push(me.isAdmin ? "/admin" : "/");
  }

  render() {
    const me = cache.get("me");

    return (
      <div className="Container">
        <style jsx>{styles}</style>
        <Brand
          alignItems="center"
          aria-label="Bouton de retour au tableau de bord"
          onClick={() => this.goToHome()}
          onKeyUp={() => this.goToHome()}
          role="button"
          tabIndex="0"
        >
          <Marianne className="BrandLogo" />
          <div className="BrandText">
            <span className="BrandTextTitle">Code du travail numérique</span>
            <span className="BrandTextSubtitle">Outil de contribution</span>
          </div>
        </Brand>
        {me.isAuthenticated && (
          <div className="User">
            <Menu />
          </div>
        )}
      </div>
    );
  }
}
