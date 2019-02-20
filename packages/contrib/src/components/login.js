import axios from "axios";
import React from "react";
import { Button as ReButton, Flex } from "rebass";
import styled from "styled-components";

const Form = styled.form`
  margin: 1rem;
`;

const Input = styled.input`
  border: 0;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1.2rem;
  line-height: 1.25;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  width: 100%;
`;

const Select = styled.select`
  border: 0;
  color: inherit;
  font-family: inherit;
  font-weight: inherit;
  font-size: 1.2rem;
  line-height: 1.25;
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
  width: 100%;
`;

const Button = styled(ReButton)`
  background-color: #2978a0;
  border-radius: 0;
  cursor: pointer;
  margin-top: 1rem;
`;

export default class Index extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      location: ""
    };

    this.updateFormData = this.updateFormData.bind(this);
    this.submit = this.submit.bind(this);
  }

  async login() {
    const { data } = await axios.post("http://localhost:3200/rpc/login", {
      email: this.state.email,
      password: "Azerty123"
    });

    // JSON Web Token
    sessionStorage.setItem("jwt", data[0].token);
  }

  updateFormData(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  async submit(event) {
    if (event !== undefined) event.preventDefault();

    if (this.state.email.length === 0 || this.state.location.length === 0) {
      return;
    }

    try {
      await this.login();
      this.props.onLog();
    } catch (e) {
      console.warn(e);
    }
  }

  render() {
    return (
      <Flex style={{ flexGrow: 1 }}>
        <Flex width={1 / 2} />
        <Flex
          flexDirection="column"
          justifyContent="center"
          width={1 / 2}
          style={{ flexGrow: 1 }}
        >
          <Form onSubmit={this.submit}>
            <Input
              onChange={this.updateFormData}
              name="email"
              placeholder="E-mail"
            />
            <Select onChange={this.updateFormData} name="location">
              <option value="">Choisissez votre centre:</option>
              <option value="fcfa979c-4025-40c3-ad7b-a22640f78235">
                Centre A
              </option>
            </Select>
            <Button onClick={this.submit}>Se connecter</Button>
          </Form>
        </Flex>
      </Flex>
    );
  }
}
