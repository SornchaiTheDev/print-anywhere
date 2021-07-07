import React from "react";
import styled from "styled-components";
import { FcGoogle } from "react-icons/fc";
import { auth, googleAuth } from "../firebase";
const LoginButton = styled.button`
  cursor: pointer;
  outline: none;
  border: none;
  border-radius: 10px;
  background: white;
  box-shadow: 0px 2px 10px 1px rgba(0, 0, 0, 0.15);
  padding: 20px 50px;
  // width: 20%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`;
const Text = styled.h1`
  font-size: ${(props) => (props.size ? props.size : 1)}rem;
  color: black;
  font-family: Athiti;
`;

const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.size ? props.size : 1)}rem;
`;

const handleLogin = () => {
  // auth().signInWithPopup(googleAuth).then(res => console.log(res))
  auth().signInWithRedirect(googleAuth);
  // .then((res) => console.log(res));
};

function LoginBtn() {
  return (
    <LoginButton onClick={handleLogin}>
      <Icon>
        <FcGoogle />
      </Icon>
      <Text>เข้าสู่ระบบด้วย Google</Text>
    </LoginButton>
  );
}

export default LoginBtn;
