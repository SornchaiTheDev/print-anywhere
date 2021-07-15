import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router";
import {
  HomeContainer,
  TitleText,
  SubText,
  BodyText,
  Group,
  InvisButton,
  Section,
  Divider,
  FileUpload,
  PrintButton,
  Input,
  PdfViewer,
  PdfBorder,
  PdfPage,
  ArrowBtn,
  Icon,
  RadioText,
} from "../Style";
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import { FaArrowLeft, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { firestore, storage } from "../firebase";
import Loading from "../Components/Loading";
import { useUser } from "../Context";
import { v4 as uuidV4 } from "uuid";

function Print() {
  const history = useHistory();
  const [file, setFile] = useState(null);
  const [previewPDF, setPreviewPDF] = useState();
  const [filePage, setFilePage] = useState(1);
  const [fileAllPage, setFileAllPage] = useState(null);
  const [details, setDetails] = useState({
    range: null,
    pages: "all",
    type: "A4",
    printform: "border",
    timetoget: `${(new Date().getHours() + 2)
      .toString()
      .padStart(2, 0)}:${new Date().getMinutes().toString().padStart(2, 0)}`,
  });

  const [empty, setEmpty] = useState(false);
  const [isMobile, setisMobile] = useState("mobile");
  const [isLoading, setIsLoading] = useState(false);

  const { user, removeQuota } = useUser();

  const fileUpload = () => {
    const upload = document.getElementById("fileupload");
    upload.click();
  };

  useEffect(() => {
    if (user === null) history.replace("/home");
  }, [user]);

  useEffect(() => {
    //Validate
    if (
      (details.pages === "choose" && details.range === "") ||
      details.timetoget === "" ||
      file === null
    ) {
      setEmpty(true);
    } else {
      setEmpty(false);
    }
  }, [details, file]);

  //Device Check
  useEffect(() => {
    const width = window.screen.width;
    if (width <= 928) {
      setisMobile(true);
    } else {
      setisMobile(false);
    }
  }, [window]);

  const handleFileUpload = (e) => {
    const pdf = e.target.files[0];

    if (pdf.type !== "application/pdf") {
      alert("ไม่รองรับไฟล์นี้");
      setFile(null);
      setPreviewPDF(undefined);
      return;
    }
    setFile(pdf);

    const Reader = new FileReader();

    Reader.addEventListener("load", () => {
      setPreviewPDF(Reader.result);
    });
    Reader.readAsDataURL(pdf);
  };

  const handlePageChange = (direction) => {
    if (direction === "left") {
      if (filePage > 1) setFilePage((prev) => prev - 1);
    } else {
      if (filePage < fileAllPage) setFilePage((prev) => prev + 1);
    }
  };

  const PrintOrder = async () => {
    setIsLoading(true);

    //Upload File To Storage
    const whereToStore = storage().ref("Works/");
    const FileNameSchema = `${uuidV4()}`;
    const fileName = whereToStore.child(FileNameSchema);
    await fileName.put(file);
    const filePath = await fileName.getDownloadURL();

    const fileType = await fileName.getMetadata();

    // Add time to queue
    const TimeToGet = new Date();
    const formTime = details.timetoget.split(":");
    TimeToGet.setHours(formTime[0], formTime[1]);

    // //Create Reference to firestore
    const docRef = uuidV4();
    firestore()
      .collection("users")
      .doc(user.uid)
      .collection("works")
      .doc(docRef)
      .set({
        fileName: file.name,
        path: filePath,
        owner: user.displayName,
        timestamp: firestore.FieldValue.serverTimestamp(),
        status: "inqueue",
      });

    // Add to queue
    firestore().collection("queue").add({
      order_doc: docRef,
      path: filePath,
      owner: user.displayName,
      ownerDoc: user.uid,
      details: details,
      fileName: file.name,
      orderTime: TimeToGet,
    });
    //Remove Quota

    await firestore()
      .collection("users")
      .doc(user.uid)
      .update({ quota: user.quota - 1 });

    setIsLoading(false);
    history.push("/success");
  };

  return (
    <>
      {isLoading && <Loading />}
      <HomeContainer>
        <InvisButton onClick={() => history.push("/home")}>
          <Group direction="row" justify="flex-start" align="center">
            <Icon>
              <FaArrowLeft />
            </Icon>
            <BodyText>กลับหน้าหลัก</BodyText>
          </Group>
        </InvisButton>

        <Section>
          <Group
            direction="row"
            justify="center"
            align="center"
            width="100%"
            height="60vh"
          >
            {previewPDF === undefined ? (
              <FileUpload onClick={fileUpload}>
                <Group justify="center" align="center" height="100%">
                  <TitleText>
                    <HiUpload />
                  </TitleText>
                  <SubText weight={500}>อัพโหลดไฟล์</SubText>
                </Group>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="fileupload"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                />
              </FileUpload>
            ) : (
              <PdfViewer>
                <PdfBorder>
                  <Document
                    renderMode="canvas"
                    file={previewPDF}
                    onLoadSuccess={({ numPages }) => setFileAllPage(numPages)}
                    onLoadError={(err) => {
                      if (err) {
                        alert("ไม่รองรับไฟล์นี้");
                        setFile(null);
                        setPreviewPDF(undefined);
                      }
                    }}
                  >
                    <Page
                      pageNumber={filePage}
                      width={isMobile ? 300 : 400}
                      // height={300}
                    />
                  </Document>
                </PdfBorder>
                <PdfPage>
                  <ArrowBtn
                    marginTop={10}
                    onClick={() => handlePageChange("left")}
                  >
                    <FaAngleLeft />
                  </ArrowBtn>
                  <BodyText size={1}>
                    หน้า {filePage} จาก {fileAllPage} หน้า
                  </BodyText>
                  <ArrowBtn
                    marginTop={10}
                    onClick={() => handlePageChange("right")}
                  >
                    <FaAngleRight />
                  </ArrowBtn>
                </PdfPage>
              </PdfViewer>
            )}
          </Group>
        </Section>
        <Section>
          <BodyText weight={500}>จำนวนหน้า</BodyText>
          <form>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, pages: e.target.value }))
                }
                type="radio"
                name="page"
                value="all"
                id="allpage"
                defaultChecked
              />
               {" "}
              <RadioText htmlFor="allpage" weight={600}>
                ทุกหน้า
              </RadioText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={14}>
              <input
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, pages: e.target.value }))
                }
                type="radio"
                name="page"
                id="choosepage"
                value="choose"
              />

              {details.pages !== "choose" ? (
                <RadioText htmlFor="choosepage" weight={600}>
                  เลือกหน้า
                </RadioText>
              ) : (
                <Group
                  direction="column"
                  justify="flex-start"
                  align="flex-start"
                  gap="0"
                >
                    <BodyText weight={600}>เลือกหน้า</BodyText>
                  <Group direction="row" justify="space-between" align="center">
                    <Input
                      // error={details.pages === "choose" && details.range === ""}
                      type="text"
                      value={details.range}
                      onChange={(e) => {
                        setDetails((prev) => ({
                          ...prev,
                          range: e.target.value,
                        }));
                      }}
                      placeholder="1 , 1-3"
                      type="text"
                    />
                  </Group>
                </Group>
              )}
            </Group>
          </form>
        </Section>

        <Divider />

        <Section>
          <BodyText weight={500}>ชนิดกระดาษ</BodyText>
          <form>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, type: e.target.value }))
                }
                name="type"
                value="A4"
                id="a4type"
                defaultChecked
              />
               {" "}
              <RadioText htmlFor="a4type" weight={600}>
                A4 ธรรมดา
              </RadioText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                value="100pound"
                id="100poundtype"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, type: e.target.value }))
                }
                name="type"
              />
               {" "}
              <RadioText htmlFor="100poundtype" weight={600}>
                กระดาษปก
              </RadioText>
            </Group>
          </form>
        </Section>
        <Divider />
        <Section>
          <BodyText weight={500}>รูปแบบการปริ้นท์</BodyText>
          <form>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, printform: e.target.value }))
                }
                name="printform"
                value="border"
                id="border"
                defaultChecked
              />
               {" "}
              <RadioText htmlFor="border" weight={600}>
                มีขอบ
              </RadioText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, printform: e.target.value }))
                }
                name="printform"
                value="borderless"
                id="borderless"
              />
               {" "}
              <RadioText htmlFor="borderless" weight={600}>
                ไร้ขอบ
              </RadioText>
            </Group>
          </form>
        </Section>
        <Divider />

        <Section>
          <BodyText weight={500}>
            เวลามารับเอกสาร (อย่างน้อย 2 ชั่วโมง)
          </BodyText>
          <form>
            <div style={{ width: 200, marginTop: 20 }}>
              <Input
                // error={details.timetoget === ""}
                type="time"
                value={details.timetoget}
                onChange={(e) =>
                  setDetails((prev) => ({ ...prev, timetoget: e.target.value }))
                }
              />
            </div>
          </form>
        </Section>
        <PrintButton disabled={empty} onClick={PrintOrder}>
          ตกลง
        </PrintButton>
      </HomeContainer>
    </>
  );
}

export default Print;
