import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Container,
  Group,
  TitleText,
  Me,
  IG,
  Section,
  BodyText,
  Time,
} from "../Style";
import LoginBtn from "../Components/LoginBtn";
import firebase, { auth, firestore } from "../firebase";
import Loading from "../Components/Loading";
import { useUser } from "../Context";
import { useCookies } from "react-cookie";
function Login() {
  const history = useHistory();
  const [cookies, setCookies] = useCookies(["_login"]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  const CreateUser = async (user) => {
    setIsLoading(true);
    setCookies("_login", "logined", { path: "/" });
    const getUser = await firestore().collection("users").doc(user.uid).get();
    if (!getUser.exists) {
      await firestore().collection("users").doc(user.uid).set({
        name: user.displayName,
        quota: 10,
      });
    }

    setIsLoading(false);
    history.replace("/home");
  };
  useEffect(() => {
    if (cookies._login === "logined") {
      history.replace("/home");
    }
    auth().onAuthStateChanged((user) => {
      setIsLoading(false);
      if (user !== null) {
        const email = user.email;
        const isPKW = /@pkw.ac.th/g.test(email);

        if (isPKW) {
          CreateUser(user);
        } else {
          auth()
            .signOut()
            .then(() => setError(true));
        }
      }
    });
  }, []);
  return (
    <>
      {isLoading && <Loading />}
      <Container justify="center">
        <Group>
          <TitleText weight="bolder" color="#83C5BE">
            SMTE
          </TitleText>
          <TitleText weight="bolder" color="#83C5BE">
            PrintAnywhere
          </TitleText>
          <Group direction="row">
            <Me color="#08090A">by </Me>
            <IG color="#FE7F2D" href="https://instagram.com/_cho_kun_">
              _cho_kun_
            </IG>
          </Group>

          {error && (
            
            <BodyText color="red" weight={500} style={{marginTop : 20}}>
              ใช้อีเมลโรงเรียนเท่านั้น
            </BodyText>
          )}
        </Group>

        <LoginBtn />
      </Container>
    </>
  );
}
//   <VerticalGroup gap={50}>
//   </VerticalGroup>

export default Login;
