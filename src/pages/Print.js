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
} from "../Style";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

import { FaArrowLeft, FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { HiUpload } from "react-icons/hi";
import { firestore, storage } from "../firebase";
import Loading from "../Components/Loading";
import { useUser } from "../Context";
import { v4 as uuidV4 } from "uuid";

function Print() {
  const history = useHistory();
  const [file, setFile] = useState();
  const [previewPDF, setPreviewPDF] = useState();
  const [filePage, setFilePage] = useState(1);
  const [fileAllPage, setFileAllPage] = useState(null);
  const [pages, setPages] = useState("all");
  const [type, setType] = useState("A4");
  const [range, setRange] = useState("all");
  const [error, setError] = useState(false);
  const [isMobile, setisMobile] = useState("mobile");
  const [timetoget, setTimeToGet] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const { filePath } = useParams();

  const { user, removeQuota } = useUser();

  const fileUpload = () => {
    const upload = document.getElementById("fileupload");
    upload.click();
  };

  //File View
  const Openfile = async () => {
    const getFile = await firestore()
      .collection("users")
      .doc(user.uid)
      .collection("works")
      .doc(filePath)
      .get();
    if (getFile.exists) {
      setPreviewPDF(getFile.data().path);
    } else {
      history.replace("/home");
    }
  };

  useEffect(() => {
    console.log(filePath);
    if (filePath !== undefined) {
      Openfile();
    }
  }, []);

  //Device Check
  useEffect(() => {
    const width = window.screen.width;
    if (width <= 928) {
      setisMobile(true);
    } else {
      setisMobile(false);
    }
  }, [window]);

  const handleCustomPage = (e) => {
    const pages = e.target.value;
    const range = pages.split("-");
    const isError = /,/g.test(pages);
    if (isError) {
      setError(true);
      return;
    }

    if (range.length === 1) {
      setRange(range[0]);
    } else {
      setRange(range);
    }
    setError(false);
  };

  const handleFileUpload = (e) => {
    const pdf = e.target.files[0];
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
    const FileNameSchema = `${new Date().getFullYear()}-${file.name}`;
    const fileName = whereToStore.child(FileNameSchema);
    await fileName.put(file);
    const filePath = await fileName.getDownloadURL();

    //Create Reference to firestore
    firestore()
      .collection("users")
      .doc(user.uid)
      .collection("works")
      .doc(uuidV4())
      .set({ fileName: file.name, path: filePath, owner: user.displayName });

    //Remove Quota

    await firestore()
      .collection("users")
      .doc(user.uid)
      .update({ quota: firestore.FieldValue.increment(-1) });
    removeQuota();
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
                  accept=".pdf"
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
                onChange={(e) => setPages(e.target.value)}
                type="radio"
                name="page"
                value="all"
                defaultChecked
              />
                <BodyText weight={600}>ทุกหน้า</BodyText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={14}>
              <input
                onChange={(e) => setPages(e.target.value)}
                type="radio"
                name="page"
                value="choose"
              />

              {pages !== "choose" ? (
                <BodyText weight={600}>เลือกหน้า</BodyText>
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
                      error={error}
                      type="text"
                      onChange={(e) => setRange(e.target.value)}
                      placeholder="1 , 1-3"
                      type="text"
                      inputMode="numeric"
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
                onChange={(e) => setType(e.target.value)}
                name="page"
                value="a4"
                defaultChecked
              />
                <BodyText weight={600}>A4 ธรรมดา</BodyText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                onChange={(e) => setType(e.target.value)}
                name="page"
                value="cover"
              />
                <BodyText weight={600}>กระดาษปก</BodyText>
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
                onChange={(e) => setType(e.target.value)}
                name="page"
                value="a4"
                defaultChecked
              />
                <BodyText weight={600}>มีขอบ</BodyText>
            </Group>
            <Group direction="row" justify="flex-start" align="center" gap={5}>
              <input
                type="radio"
                onChange={(e) => setType(e.target.value)}
                name="page"
                value="cover"
              />
                <BodyText weight={600}>ไร้ขอบ</BodyText>
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
                type="text"
                placeholder="12:34"
                value={timetoget}
                onChange={(e) => setTimeToGet(e.target.value)}
              />
            </div>
          </form>
        </Section>
        <PrintButton onClick={PrintOrder}>ตกลง</PrintButton>
      </HomeContainer>
    </>
  );
}

export default Print;
