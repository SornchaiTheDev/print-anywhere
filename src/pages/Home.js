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
  const [isLoading, setIsLoading] = useState(true);
  const [works, setWorks] = useState([]);
  const [cookies, setCookies, removeCookie] = useCookies(["_login"]);
  const [user, setUser] = useState(null);
  const [isOutOfQuota, setIsOutOfQuota] = useState(true);
  const { setQuota } = useUser();

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
    await firestore()
      .collection("users")
      .doc(uid)
      .onSnapshot(
        (snapshot) => (
          setQuota(snapshot.data().quota),
          setUser((prev) => ({
            ...prev,
            ...snapshot.data(),
          }))
        )
      );

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

  //Check out of quota
  useEffect(() => {
    if (user !== null && user.quota <= 0) {
      setIsOutOfQuota(true);
    }
    if (user !== null && user.quota > 0) setIsOutOfQuota(false);
  }, [user]);

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
                      width="100%"
                    >
                      <BodyText weight={500}>{index + 1}.</BodyText>

                      <BodyText weight={500}>
                        {fileName.slice(0, 20)} {fileName.length > 20 && "..."}
                      </BodyText>
                    </Group>
                    <WorkStatus status={status}>
                      <WorkStatusText>
                        {status === "wait"
                          ? "กำลังปริ้นท์"
                          : status === "inqueue"
                          ? "รอคิว"
                          : "ไปรับได้เลย"}
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

      <PrintButton
        disabled={isOutOfQuota}
        onClick={() => history.push("/order")}
      >
        สั่งปริ้นท์
      </PrintButton>
    </>
  );
}

export default Home;
