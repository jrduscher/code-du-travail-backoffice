import React from "react";

import Hr from "../Hr";

describe("[Contrib] elements/<Hr />", () => {
  it(`should pass`, () => {
    const $hr = testRender(<Hr />);

    expect($hr).toMatchSnapshot();
  });
});