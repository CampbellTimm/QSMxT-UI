import { Card, Typography, Popover, Form, Tag, Skeleton } from 'antd';
import React from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import globalStyles from '../util/globalStyles';

const { Title } = Typography;

const styles = {
  icon: { color: '#1677ff', fontSize: 28 },
  iconContainer: { marginTop: 20 },
  questionMark: { color: '#1677ff', marginLeft: 5, fontSize: 15  },
  questionMarkContainer: { marginTop: 15 },
  titleStyles: { marginTop: 20 }
}

interface Props {
  title: string,
  width: number | string
  children: React.ReactNode,
  Icon: any,
  helperText: React.ReactNode,
  loading: boolean,
  height?: number
}

const ContentCard: React.FC<Props> = ({ title, children, width, Icon, helperText, loading, height }) => {
  const rootStyle: any = { minWidth: width, maxWidth: width }

  const cardStyle = height
    ? { minHeight: height, maxHeight: height }
    : {};
  return (
    <div style={rootStyle}>
      <Card 
        style={cardStyle}
        title={
          <div style={globalStyles.flexBoxRowSpaceBetween} >
            <div style={globalStyles.flexBoxRow}>
              <Title style={styles.titleStyles} level={3}>
                {title} 
              </Title>
              <Popover title={null} content={helperText} >
                <div style={styles.questionMarkContainer}>
                  <QuestionCircleOutlined style={styles.questionMark} />
                </div>
              </Popover>
            </div>
            <div style={styles.iconContainer}>
              <Icon style={styles.icon} />
            </div>
          </div>
        }
        actions={[]}
      > 
        {loading ? <Skeleton /> : children}
      </Card>
    </div>
  )
}

export default ContentCard;