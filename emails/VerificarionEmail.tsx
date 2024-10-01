import { Html, Head, Body, Container, Heading, Text } from "@react-email/components";
import React from "react";

interface VerificationEmailProps {
  username: string;
  otp: string;
}

const VerificationEmail: React.FC<VerificationEmailProps> = ({ username, otp }) => {
  return (
    <Html>
      <Head />
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>Hello, {username}</Heading>
          <Text style={text}>
            Thank you for registering! Please use the following verification code to complete your registration:
          </Text>
          <Heading style={otpStyle}>{otp}</Heading>
          <Text style={text}>
            If you didn't request this code, please ignore this message.
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default VerificationEmail;

const main: React.CSSProperties = {
  backgroundColor: "#f4f4f4",
  fontFamily: "Arial, sans-serif",
  padding: "20px",
};

const container: React.CSSProperties = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  maxWidth: "600px",
  margin: "0 auto",
};

const heading: React.CSSProperties = {
  fontSize: "24px",
  marginBottom: "20px",
  color: "#333",
};

const text: React.CSSProperties = {
  fontSize: "16px",
  color: "#555",
};

const otpStyle: React.CSSProperties = {
  fontSize: "32px",
  fontWeight: "bold",
  color: "#000",
  marginBottom: "30px",
};
