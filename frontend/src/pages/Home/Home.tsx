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
          Within this site you are able to handle the full QSM workflow after you have upload the data for your subjects. All data it handled by the site, add no external file management is required to view and manage your data once uploaded.
        </Text>
      </Paragraph>
      <Paragraph>
        <Text>
          In the <Link href="/yourData">Data Page</Link>, you can upload the data for your subjects in either BIDS or DICOM format. If your data is in the DICOM format, it will automatically be sorted and converted to BIDS. You can also add your subjects to cohorts in order to sort them into workable chunks.
        </Text>
      </Paragraph>

      <Paragraph>
        <Text>
          In the <Link href="/run">Run Page</Link>, you are able to run the full QSM pipeline, involving optional segmentation and analysis.
        </Text>
      </Paragraph>

      <Paragraph>
        <Text>
          In the <Link href="/results">Results Page</Link>, view the resulting Niftii images from the QSM pipeline and view the results from the analysis.
        </Text>
      </Paragraph>
    </div>
  )
}

export default Home;