import React from "react";
import { Image, Typography, Divider } from 'antd';

const { Title, Paragraph, Text, Link } = Typography;

export default () => {
  return (
    <div style={{ paddingLeft: 30 }}>
      <div style={{ display: 'flex', flexDirection: 'row'}}>
        <Image
          width={200}
          src="http://localhost:4000/logo.png"
        />
        <Title style={{ fontSize: 100, paddingTop: 25, paddingLeft: 20 }}>QSMxT</Title>
     
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
    </div>
  )
}