import { Layout, Menu, Image } from 'antd';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home'
import YourDataPage from './pages/YourDataPage/YourDataPage'
import Run from './pages/RunPage/RunPage'
import Qsm from './pages/Results/Results'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import apiClient from './util/apiClient';
import { context } from './util/context';
import SelectorTree from './components/SelectorTree/SelectorTree';
import io from 'socket.io-client';
import { API_URL } from './core/constants';
import LoadingPage from './pages/LoadingPage/LoadingPage';
import { FolderOpenOutlined, HomeOutlined, InsertRowLeftOutlined, PlaySquareOutlined } from '@ant-design/icons';

const { Header, Content } = Layout;

const menuItems = [
  {
    key: 'home',
    label: 'Home',
    icon: <HomeOutlined />
  },
  {
    key: 'yourData',
    label: 'Your Data',
    icon: <FolderOpenOutlined />
  },
  {
    key: 'run',
    label: 'Run',
    icon: <PlaySquareOutlined />
  },
  {
    key: 'results',
    label: 'Results',
    icon: <InsertRowLeftOutlined />
  },
];

const styles = {
  content: { 
    minHeight: 'calc(100vh - 104px)',  // diff = 50 pixels
    maxHeight: 'calc(100vh - 104px)',  
    padding: '24px', 
    background:'#fff',
    width: 'calc(100% - 38px)', 
    margin: 20,
  },
  contentBody: { 
    display: 'flex', 
    flexDirection: 'row' as 'row', 
    width: '100%', 
    minHeight: 'calc(100vh - 154px)',
    maxHeight: 'calc(100vh - 154px)',
  },
  flexBoxRow: {
    display: 'flex',
    flexDirection: 'row' as 'row',

  }
}


const App = () => {
  const [cohorts, setCohorts]: [any, any] = useState(null);
  const [subjects, setSubjects]: [any, any] = useState(null);
  const [selectedSubject, setSelectedSubject]: [any, any] = useState(null);
  const [selectedCohort, setSelectedCohort]: [any, any] = useState(null);
  const [queue, setQueue]: [any, any] = useState(null);
  const [loading, setLoading]: [boolean, any] = useState(true);

  console.log(selectedSubject);

  const fetchSubjectData = async () => {
    const subjects = await apiClient.getSubjects()
    setSubjects(subjects);
  }

  const fetchCohortData = async () => {
    const cohorts = await apiClient.getCohorts();
    setCohorts(cohorts);
  }

  const setupQueueSocket = async () => {
    const socket = io(`${API_URL}/queue`);
    socket.on('data', (data) => {
      console.log('Received message:', data);
      const newQueue = JSON.parse(data);


      // queue && queue.forEach(prevRun => {
      //   if (!newQueue.find(newRun => newRun.id === prevRun.id)) {
      //     message.success(`${prevRun.type} completed`);
      //   }
      // })


      setQueue(newQueue);

    });
  }

  useEffect(() => {
    fetchSubjectData();
    fetchCohortData();
    setupQueueSocket();
  },[]);

  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'

  const navigate = useNavigate();

  const contextValue = {
    cohorts,
    subjects,
    selectedSubject,
    selectedCohort,
    queue,
    setSelectedCohort,
    setSelectedSubject,
    fetchSubjectData,
    fetchCohortData,
    navigate
    // setCohorts: updateCohorts
  }

  return (
    <Layout>
      <div style={styles.flexBoxRow}>
        <Header style={{ width: 'calc(100% - 320px)' }}>
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={({ key }) => {
              navigate(`/${key}`)
            }}
            selectedKeys={[selectedKey]}
            items={loading ? [] : menuItems}
          />
        </Header>
        <div style={{  display: 'flex', flexDirection: 'row', background: '#001529', color: 'rgb(255, 255, 255)'}}>
          <b style={{ fontSize: 32, lineHeight: '64px', minHeight: '64px',  }}>
            QSMxT v2.1.0
          </b>
          <div style={{ width: 112  }}>
            <Image
              preview={false}
              width={90}
              style={{ marginTop: 11, marginRight: 11, marginLeft: 11 }}
              height={42}
              src={`https://qsmxt-ui-images.s3.ap-southeast-2.amazonaws.com/menuBar.PNG`}
            />
          </div>
        </div> 
      </div>
      <Content style={styles.content}>
        <context.Provider value={contextValue as any}>
          <div style={styles.contentBody}>
            {loading
              ? <LoadingPage setLoading={setLoading} />
              : <>
                <SelectorTree />
                <div style={{ overflowY: 'scroll', width: '100%', paddingRight: 14 }}>
                  <Routes>
                    <Route path="/home" element={<Home />} />
                    <Route path="/run" element={<Run />} />
                    <Route path="/yourData" element={<YourDataPage />} />
                    <Route path="/output" element={<Qsm />} />
                    <Route path="/" element={ <Navigate to="/home" /> } />
                  </Routes>  
                </div>
              </>
            }
          </div>
        </context.Provider>
      </Content>

    </Layout>
  )
};

export default App;