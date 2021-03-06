import styled from "@emotion/styled";
import React from "react";
import { Flex, Text } from "rebass";

const Container = styled(Flex)`
  margin-bottom: 0.5rem;
`;
const Error = styled(Text)`
  color: red;
  font-size: 0.75rem;
  font-weight: 600;
  height: 1rem;
`;

const Field = ({ children, error = null, ...props }) => (
  <Container {...props}>
    {children}
    {error !== null && <Error>{error}</Error>}
  </Container>
);

export default Field;
