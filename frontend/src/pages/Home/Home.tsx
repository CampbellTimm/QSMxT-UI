import React from "react";
import { Image, Typography, Divider } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

// TODO - add loading for the image
const Home = () => {
  return (
    <div style={{ paddingLeft: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <Image
          // width={200}
          preview={false}
          height={200}
          src="https://qsmxt-ui-images.s3.ap-southeast-2.amazonaws.com/logo.PNG"
        />
        <Title style={{ fontSize: 100, paddingTop: 25, paddingLeft: 20, marginTop: 20 }}>QSMxT</Title>
     
      </div>
      <Divider />

      <Paragraph>
        <Text>
          QSMxT is a complete and end-to-end QSM processing and analysis framework that excels at automatically reconstructing and processing QSM for large groups of participants.
        </Text>
      </Paragraph>

      <Paragraph>
        <Text>
          In the <Link href="/inputData">Data Page</Link>, upload your DICOM or BIDS data to a Cohort 
        </Text>
      </Paragraph>

      <Paragraph>
        <Text>
          In the <Link href="/run">Run Page</Link>, run Segmentations of the QSM pipeline in your uploaded data
        </Text>
      </Paragraph>

      <Paragraph>
        <Text>
          In the <Link href="/output">Results Page</Link>, view the resulting Niftii images and analysis results from the QSM pipeline
        </Text>
      </Paragraph>

       {/* <br />
       A
       <br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A<br />
       A */}
    </div>
  )
}

export default Home;