import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import {
  Container,
  Group,
  TitleText,
  Me,
  IG,
  InputGroup,
  Input,
  QueueText,
  Button,
} from "../Style";
import LoginBtn from "../Components/LoginBtn";
import firebase, { auth, firestore } from "../firebase";
import Loading from "../Components/Loading";
import { useUser } from "../Context";
function Login() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);

  const CreateUser = async (user) => {
    setIsLoading(true);
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
    auth().onAuthStateChanged((user) => {
      if (user !== null) {
        const email = user.email;
        const isPKW = /@pkw.ac.th/g.test(email);

        if (isPKW) {
          CreateUser(user);
        } else {
          auth()
            .signOut()
            .then(() => alert("ใช้อีเมลโรงเรียนเท่านั้น"));
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
            SmartPrint
          </TitleText>
          <Group direction="row">
            <Me color="#08090A">by </Me>
            <IG color="#FE7F2D" href="https://instagram.com/_cho_kun_">
              _cho_kun_
            </IG>
          </Group>
          <QueueText size={1.25}>กำลังปริ้นท์อยู่ 5 คิว</QueueText>
        </Group>
        <LoginBtn />
        {/* <InputGroup>
        <Input
          placeholder="เลขประจำตัวนักเรียน"
          type="number"
          inputMode="numeric"
        />
        <Input
          placeholder="เลขบัตรประจำตัวประชาชน"
          type="number"
          inputMode="numeric"
        />
        <Button onClick={() => history.push("/home")}>เข้าสู่ระบบ</Button>
      </InputGroup> */}
      </Container>
    </>
  );
}
//   <VerticalGroup gap={50}>
//   </VerticalGroup>

export default Login;
