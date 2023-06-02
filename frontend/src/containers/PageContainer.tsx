import React from 'react';
import { Divider, Typography } from 'antd';

const { Title} = Typography;

const styles = {
  contentContainer: {
    display: 'flex', 
    flexDirection: 'row' as 'row',
    width: '100%', 
    maxWidth: `1200`,
    flexWrap: 'wrap' as 'wrap',
    justifyContent: 'center' as 'center'
  },
  layout: {
    maxWidth: 1100 
  },
  noTopMargin: {
    marginTop: 0
  }
}

interface Props {
  title: string,
  children: React.ReactNode,
  gap: number
}

const PageContainer: React.FC<Props> = ({ title, children, gap }) => {
  return (
    <div style={styles.layout}>
      <div style={{ textAlign: 'center'}}>
        <Title style={styles.noTopMargin} level={1}>{title}</Title>
      </div>
      <Divider />
      <div style={{ ...styles.contentContainer, gap }}>
        {children}
      </div>
    </div>
  )
}

export default PageContainer;