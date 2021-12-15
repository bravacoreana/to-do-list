import styled from "styled-components";

export interface ButtonProps {
  onClick?: () => void;
  children: string;
}

const ThemeBox = styled.div`
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  margin: 20px 0;
  margin-left: 5px;
  float: right;
  background-color: ${(props) => props.theme.accentColor};
`;

const Theme = styled.span`
  width: 16px;
  height: 16px;
  text-align: center;
  display: block;
  &:hover {
    cursor: pointer;
    color: ${(props) => props.theme.textColor};
    font-weight: 600;
  }
`;

export default function Button({ onClick, children }: ButtonProps) {
  return (
    <ThemeBox onClick={onClick}>
      <Theme>{children}</Theme>
    </ThemeBox>
  );
}
