import {Html,Head,Font,Preview,Heading,Row,Section,Text,Button} from '@react-email/components'
interface VerificarionEmailProps {
  username : string;
  otp : string
}
export default function VerificarionEmail({username,otp} : VerificarionEmailProps)  {
  return (
    <Html >
      <Head>
        <title>Verification Code</title>
        <Font 
        fontFamily='Roboto'
        fallbackFontFamily="Verdana"
        webFont={{
          url : 'https://fonts.gstatic.com/s/roboto/v27/KF0mCnqEu91Fr1Mu4mxKKTU1Kg.woff2',
          format : 'woff2'
        }}
        fontWeight={400}
        fontStyle='normal'
        />
        <Preview>
          Here$apos;s your verification code : {otp}
        </Preview>
        <Section>
          <Row>
            <Heading as='h2'> Hello {username},</Heading>
        
          <Text>
            Thank you for registering. Please use the following verification code to complete your registration :
          </Text>
          </Row>
        <Row>
          <Text>{otp}</Text>
        </Row>
        <Text>
          If you did not request this code, please ignore this email.
        </Text>

        </Section>
      </Head>
    </Html>
  )
}