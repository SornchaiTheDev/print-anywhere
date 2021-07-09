import styled from "styled-components";

export const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  display: flex;
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
  align-items: ${(props) => (props.align ? props.align : "center")};
  flex-direction: column;
  background: #edf6f9;
  gap: 50px;
`;

export const Group = styled.div`
  display: flex;
  width: ${(props) => (props.width ? `${props.width}` : "auto")};
  min-height: ${(props) => (props.height ? `${props.height}` : "auto")};
  justify-content: ${(props) => (props.justify ? props.justify : "center")};
  align-items: ${(props) => (props.align ? props.align : "center")};
  flex-direction: ${(props) => (props.direction ? props.direction : "column")};
  gap: ${(props) => (props.gap ? props.gap : 10)}px;
`;

export const TitleText = styled.h2`
  font-size: 2rem;
  color: ${(props) => (props.color ? props.color : "#08090A")};
  font-family: Athiti;
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
`;
export const SubText = styled.h2`
  font-size: 1.5rem;
  color: ${(props) => (props.color ? props.color : "#08090A")};
  font-family: Athiti;
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
`;
export const BodyText = styled.h2`
  font-size: ${(props) => (props.size ? props.size : 1.25)}rem;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  color: ${(props) => (props.color ? props.color : "#08090A")};
  font-family: Athiti;
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
  word-wrap: break-word;
`;

export const InputGroup = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 30px;
`;

export const Input = styled.input`
  width: 70%;
  background: none;
  outline: none;
  border: 1px solid ${(props) => (props.error ? "red" : "lightgrey")};
  border-radius: 6px;
  padding: 10px;
  color: #292f36;
  font-size: 16px;
  font-family: Athiti;
  font-weight: 500;
  ::placeholder {
    color: lightgrey;
  }
  :focus {
    border: 1px solid ${(props) => (props.error ? "red" : "#006d77")};
  }
`;

export const Button = styled.button`
  background: #006d77;
  border: none;
  outline: none;
  padding: 10px 50px;
  border-radius: 10px;
  color: white;
  font-family: Athiti;
  font-size: 1rem;
  box-shadow: 1px 2px 1px 1px rgba(0, 0, 0, 0.25);
`;

export const QueueText = styled.h3`
  font-size: ${(props) => (props.size ? props.size : 1.5)}rem;
  font-family: Athiti;
  color: #292f36;
`;

export const Me = styled.h3`
  font-size: 1rem;
  color: ${(props) => (props.color ? props.color : "#83C5BE")};
  font-family: Fredoka One;
`;

export const IG = styled.a`
  font-size: 1rem;
  color: ${(props) => (props.color ? props.color : "#83C5BE")};
  font-family: Fredoka One;
`;

// Profile Page

export const HomeContainer = styled.div`
  padding: 30px;
  background: #edf6f9;
  padding-bottom: 100px;
  min-height: 100vh;
  // display : flex;
  // justify-content : center;
  // align-items : center;
  // flex-direction : column;
  // flex-wrap : wrap;
`;

export const ProfileCard = styled.div`
  width: 90%;
  height: 50vh;
  border-radius: 10px;
  box-shadow: 1px 2px 10px 0.25px rgba(0, 0, 0, 0.25);
`;

export const ItemGroup = styled.div`
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: ${(props) => (props.gap ? props.gap : 10)}px;
  border: 1px solid black;
  border-radius: 10px;
`;

export const InvisButton = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  margin-top: 10px;
`;

export const Section = styled.div`
  margin-top: 20px;
  margin-bottom: 20px;
  width: 100%;
  // display: flex;
  // justify-content: ${(props) => (props.justify ? props.justify : "center")};
  // align-items: ${(props) => (props.align ? props.align : "center")};
  // flex-direction: ${(props) =>
    props.direction ? props.direction : "column"};
`;

export const Divider = styled.div`
  width: 100%;
  border: 1px dashed grey;
  margin-top: 20px;
  margin-bottom: 20px;
`;

export const WorkBox = styled.div`
  width: 100%;
`;
export const WorkShowCase = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
  gap: 10px;
`;

export const WorkStatus = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30%;
  background: ${(props) =>
    props.status
      ? props.status === "wait"
        ? "#FE7F2D"
        : props.status === "inqueue"
        ? "lightgrey"
        : "#83c5be"
      : "#83c5be"};
  border-radius: 20px;
  padding: 10px;
`;

export const WorkStatusText = styled.h5`
  font-size: 1 rem;
  color: white;
`;

export const PrintButton = styled.button`
  cursor: pointer;
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 10vh;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-family: Athiti;
  font-weight: 600;
  font-size: 1.25rem;
  color: white;
  background: ${(props) => (props.disabled ? "lightgrey" : "#83c5be")};
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
`;

export const FileUpload = styled.div`
  cursor: pointer;
  @media (max-width: 928px) {
    width: 50%;
    // min-width: 200px;
    // min-height: 400px;
  }
  @media (min-width: 928px) {
    width: 20%;
  }
  padding: 50px 20px;
  background: white;
  border-radius: 10px;
  box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.25);
`;

//Print

export const PdfViewer = styled.div`
  user-select: none;
  position: relative;
  min-width: 200px;
  margin: 50px;
  // height : 90vh;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export const PdfBorder = styled.div`
  // border: 6px solid white;
  border-radius: 10px;
  box-shadow: 0px 4px 10px 0.5px rgba(0, 0, 0, 0.15);
  overflow: hidden;
`;

export const PdfPage = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  position: absolute;
  background: white;
  padding: 10px;
  border-radius: 10px;
  bottom: -20px;
  box-shadow: 0px 4px 10px 2px rgba(0, 0, 0, 0.15);
`;
export const ArrowBtn = styled.button`
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  font-size: 1.25rem;
  margin-top: ${(props) => (props.marginTop ? props.marginTop : 0)}px;
  color: ${(props) => (props.color ? props.color : "#08090A")};
  font-family: Athiti;
  font-weight: ${(props) => (props.weight ? props.weight : "normal")};
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${(props) => (props.size ? props.size : 1)}rem;
`;
