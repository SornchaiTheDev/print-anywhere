import React from "react";
import styled from "styled-components";
import { Player } from "@lottiefiles/react-lottie-player";

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.25);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999;
`;

const LoadingBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100px;
  height: 100px;
  border-radius: 100px;
  background: white;
`;

function Loading() {
  return (
    <Container>
      <LoadingBox>
        <Player
          autoplay
          loop
          src="https://assets10.lottiefiles.com/packages/lf20_kJNwM4.json"
          style={{ height: "60px", width: "60px" }}
        />
      </LoadingBox>
    </Container>
  );
}

export default Loading;
