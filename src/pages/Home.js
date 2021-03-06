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
import { AiFillDelete } from "react-icons/ai";

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
        setUser(user);
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

  const WorkComponent = ({ fileName, status, index, doc }) => {
    const Remove = () => {
      if (status === "success") {
        firestore()
          .collection("users")
          .doc(user.uid)
          .collection("works")
          .doc(doc)
          .delete();
      }
    };
    return (
      <Group
        direction="row"
        justify="space-between"
        align="center"
        width="100%"
      >
        <Group direction="row" justify="flex-start" align="center" width="100%">
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
                ? "????????????????????????????????????"
                : status === "inqueue"
                ? "???????????????"
                : "?????????????????????????????????"}
            </WorkStatusText>
          </WorkStatus>
          {status === "success" && (
            <Icon size={1.5} onClick={Remove}>
              <AiFillDelete />
            </Icon>
          )}
        </Group>
      </Group>
    );
  };

  return (
    <>
      {isLoading && <Loading />}

      <HomeContainer>
        <Group direction="row" justify="space-between">
          <Group direction="column" justify="center" align="flex-start" gap="0">
            <SubText color="#08090A" weight={600}>
              ???????????????!
            </SubText>
            <TitleText color="#83C5BE" weight="bolder">
              {user !== null && user.name !== null ? user.name : "???????????????????????????"}
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
            ? ` ????????????????????????????????? ${user.quota} ????????????`
            : "???????????????????????????"}
        </SubText>

        <Divider />
        <Section direction="column" justify="center" align="flex-start">
          <Group direction="row" justify="space-between">
            <SubText weight={600}>???????????????????????????</SubText>
            {/* <Button onClick={() => history.push("/print")}>??????????????????????????? </Button> */}
          </Group>
          <WorkShowCase>
            {works.length > 0 ? (
              works.map(({ fileName, status, id }, index) => (
                <WorkComponent
                  doc={id}
                  fileName={fileName}
                  status={status}
                  index={index}
                  key={index}
                />
              ))
            ) : (
              <SubText>?????????????????????????????????</SubText>
            )}
          </WorkShowCase>
        </Section>
      </HomeContainer>

      <PrintButton
        disabled={isOutOfQuota}
        onClick={() => history.push("/order")}
      >
        ?????????????????????????????????
      </PrintButton>
    </>
  );
}

export default Home;
