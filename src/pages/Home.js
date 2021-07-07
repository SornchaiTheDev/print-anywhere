import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";
import {
  HomeContainer,
  TitleText,
  SubText,
  BodyText,
  Group,
  InvisButton,
  Section,
  Divider,
  WorkBox,
  WorkShowCase,
  PrintButton,
  Icon,
  Container,
} from "../Style";
import { GoSignOut } from "react-icons/go";
import { AiFillFilePdf, AiFillFileImage } from "react-icons/ai";

import Loading from "../Components/Loading";
import { auth, firestore } from "../firebase";
import { useUser } from "../Context";

function Home() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [works, setWorks] = useState([]);
  const { user } = useUser();

  // useEffect(() => {
  //   setTimeout(() => {
  //     setIsLoading(false);
  //   }, 2000);
  // }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => history.replace("/"));
  };

  const getWork = async (uid) => {
    setIsLoading(true);
    const works = await firestore()
      .collection("users")
      .doc(uid)
      .collection("works")
      .get();

    const docs = [];
    works.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
    setWorks(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user !== null) {
        getWork(user.uid);
      }
    });
  }, []);

  return (
    <>
      {isLoading && <Loading />}

      <HomeContainer>
        <Group direction="row" justify="space-between">
          <Group direction="column" justify="center" align="flex-start" gap="0">
            <SubText color="#08090A" weight={600}>
              ฮาโหล!
            </SubText>
            <TitleText color="#83C5BE" weight="bolder">
              {user.displayName !== undefined ? user.displayName : "กำลังโหลด"}
            </TitleText>
          </Group>

          <InvisButton onClick={handleLogout}>
            <Icon size={2}>
              <GoSignOut />{" "}
            </Icon>
          </InvisButton>
        </Group>

        <SubText weight="bolder" color="#FE7F2D">
          {user.quota !== undefined
            ? ` ปริ้นได้อีก ${user.quota} แผ่น`
            : "กำลังโหลด"}
        </SubText>

        <Divider />
        <Section direction="column" justify="center" align="flex-start">
          <Group direction="row" justify="space-between">
            <SubText weight={600}>งานของฉัน</SubText>
            {/* <Button onClick={() => history.push("/print")}>สั่งปริ้น </Button> */}
          </Group>
          <WorkShowCase>
            {works.length > 0 ? (
              works.map(({ fileName, id }, index) => (
                <InvisButton
                  // onClick={() => history.push(`/print/${id}`)}
                  key={index}
                >
                  <Group direction="row" justify="space-between" align="center">
                    <BodyText weight={500}>{index + 1}.</BodyText>
                    <BodyText weight={500}>{fileName}</BodyText>
                    <Icon>
                      <AiFillFilePdf />
                    </Icon>
                  </Group>
                </InvisButton>
              ))
            ) : (
              <SubText>ยังไม่มีงาน</SubText>
            )}
          </WorkShowCase>
        </Section>
      </HomeContainer>

      <PrintButton onClick={() => history.push("/order")}>
        สั่งปริ้นท์
      </PrintButton>
    </>
  );
}

export default Home;
