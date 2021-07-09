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
  WorkStatus,
  WorkStatusText,
} from "../Style";
import { GoSignOut } from "react-icons/go";
import { AiFillFilePdf, AiFillFileImage } from "react-icons/ai";

import Loading from "../Components/Loading";
import { auth, firestore } from "../firebase";
import { useUser } from "../Context";
import { useCookies } from "react-cookie";

function Home() {
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [works, setWorks] = useState([]);
  const [cookies, setCookies, removeCookie] = useCookies(["_login"]);
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        removeCookie("_login");
        history.replace("/");
      });
  };

  const getUser = async (uid) => {
    setIsLoading(true);
    const doc = await firestore().collection("users").doc(uid).get();
    setUser((prev) => ({ ...prev, ...doc.data() }));
    setIsLoading(false);
  };

  const getWork = async (uid) => {
    setIsLoading(true);
    const works = await firestore()
      .collection("users")
      .doc(uid)
      .collection("works")
      .orderBy("timestamp", "desc")
      .onSnapshot((snapshot) => {
        const docs = [];

        snapshot.forEach((doc) => docs.push({ ...doc.data(), id: doc.id }));
        setWorks(docs);
      });

    setIsLoading(false);
  };

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (user !== null) {
        getWork(user.uid);
        getUser(user.uid);
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
              {user !== null && user.name !== null ? user.name : "กำลังโหลด"}
            </TitleText>
          </Group>

          <InvisButton onClick={handleLogout}>
            <Icon size={2}>
              <GoSignOut />{" "}
            </Icon>
          </InvisButton>
        </Group>

        <SubText weight="bolder" color="#FE7F2D">
          {user !== null && user.quota !== undefined
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
              works.map(({ fileName, status }, index) => (
                <Group
                  direction="row"
                  justify="space-between"
                  align="center"
                  width="100%"
                  key={index}
                >
                  <Group
                    direction="row"
                    justify="flex-start"
                    align="center"
                    width="100%"
                  >
                    <Group
                      direction="row"
                      justify="flex-start"
                      align="center"
                      width="70%"
                    >
                      <BodyText weight={500}>{index + 1}.</BodyText>
                      <div style={{ width: "70%" }}>
                        <BodyText weight={500}>{fileName}</BodyText>
                      </div>
                      <Icon>
                        <AiFillFilePdf />
                      </Icon>
                    </Group>
                    <WorkStatus status={status}>
                      <WorkStatusText>
                        {status === "wait"
                          ? "กำลังปริ้นท์"
                          : status === "inqueue"
                          ? "รอคิว"
                          : "เสร็จแล้ว"}
                      </WorkStatusText>
                    </WorkStatus>
                  </Group>
                </Group>
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
