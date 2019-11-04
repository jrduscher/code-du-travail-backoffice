import Router from "next/router";
import React from "react";

import Menu from "../Menu";
import cache from "../../cache";

import styles from "./styles";
import Marianne from "./marianne.svg";

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
        <div
          aria-label="Bouton de retour au tableau de bord"
          className="Brand"
          onClick={() => this.goToHome()}
          onKeyUp={() => this.goToHome()}
          role="button"
          tabIndex="0"
        >
          <Marianne
            alt="Code du travail numérique"
            style={{
              height: "3rem",
              width: "auto"
            }}
          />
          <div className="BrandText">
            <span className="BrandTextTitle">Code du travail numérique</span>
            <span className="BrandTextSubtitle">Outil de contribution</span>
          </div>
        </div>
        {me.isAuthenticated && (
          <div className="User">
            <Menu />
          </div>
        )}
      </div>
    );
  }
}