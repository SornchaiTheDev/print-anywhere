import React, { useEffect } from "react";
import { Container, HomeContainer } from "../Style";
import { Player } from "@lottiefiles/react-lottie-player";
import { useHistory } from "react-router";

function Success() {
  const history = useHistory();

  useEffect(() => {
    setTimeout(() => {
      history.replace("/home");
    }, 3000);
  }, []);

  return (
    <Container>
      <Player
        autoplay
        loop
        src="../lottie/printing.json"
        style={{ height: "300px", width: "300px" }}
      />
    </Container>
  );
}

export default Success;
