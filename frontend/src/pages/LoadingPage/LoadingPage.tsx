import React, { useEffect, useState } from 'react';
import { Image, Progress, Spin } from 'antd';
import apiClient from '../../util/apiClient';

interface Props {
  setLoading: (loading: boolean) => void
}

const LoadingPage: React.FC<Props> = ({ setLoading }) => {
  const [status, setStatus]: [any, any] = useState(null);
  
  let interval;
  useEffect(() => {
    const fetchStatus = async () => {
      const { status } = await apiClient.getStatus();
      setStatus(status);
  
      if (status === 'ok') {
        clearInterval(interval);
        setLoading(false);
      }
    }
    fetchStatus();
    interval = setInterval(fetchStatus, 500);
  }, [])

 
  return (
    <div style={{ minWidth: '100%', minHeight: '100%', marginTop: 80, display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
      <div style={{ minWidth: 350, minHeight: 350 }}>
        <Image
          preview={false}
          // width={200}
          height={350}
          src="https://qsmxt-ui-images.s3.ap-southeast-2.amazonaws.com/logo.PNG"
        />
        

      </div>
      <div style={{ display: 'flex', flexDirection: "column", marginLeft: 30  }}>
          <Progress 
          size={200}
          type="circle" percent={75} 
          style={{ marginLeft: 25, marginBottom: 18 }}
          />
          <b style={{ fontSize: 60 }}>
            Loading <Spin size='large'/>
          </b>
        </div>
     
    </div>
  )
}

export default LoadingPage;