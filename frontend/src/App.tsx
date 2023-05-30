import { Layout, Menu, Image, notification } from 'antd';
import { Routes, Route, Navigate } from "react-router-dom";
import Home from './pages/Home/Home'
import YourDataPage from './pages/YourDataPage/YourDataPage'
import Run from './pages/RunPage/RunPage'
import Results from './pages/Results/Results'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import apiClient from './util/apiClient';
import { Page, context } from './util/context';
import SelectorTree from './components/SelectorTree/SelectorTree';
import io from 'socket.io-client';
import { API_URL } from './core/constants';
import LoadingPage from './pages/LoadingPage/LoadingPage';
import { FolderOpenOutlined, HomeOutlined, InsertRowLeftOutlined, PlaySquareOutlined } from '@ant-design/icons';
import { Job, JobType } from './types';

const { Header, Content } = Layout;

const menuItems = [

  {
    key: Page.Home,
    label: 'Home',
    icon: <HomeOutlined />
  },
  {
    key: Page.YourData,
    label: 'Your Data',
    icon: <FolderOpenOutlined />
  },
  {
    key: Page.Run,
    label: 'Run',
    icon: <PlaySquareOutlined />
  },
  {
    key: Page.Results,
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
    flexDirection: 'row' as 'row'
  }
}


const App = () => {


  const [cohorts, setCohorts]: [any, any] = useState(null);
  const [subjects, setSubjects]: [any, any] = useState(null);
  const [selectedSubjects, setSelectedSubjects]: [any, any] = useState([]);
  const [selectedCohorts, setSelectedCohorts]: [any, any] = useState([]);
  const [queue, setQueue]: [Job[] | null, any] = useState(null);
  const [loading, setLoading]: [boolean, any] = useState(true);

  const fetchSubjectData = async () => {
    const subjects = await apiClient.getSubjects()
    setSubjects(subjects);
  }

  const fetchCohortData = async () => {
    const cohorts = await apiClient.getCohorts();
    setCohorts(cohorts);
  }

      // const socket = io(`${API_URL}/queue`);
    // socket.on('data', (data) => {
    //   console.log('Received message:', data);
    //   const newQueue = JSON.parse(data);


    //   // queue && queue.forEach(prevRun => {
    //   //   if (!newQueue.find(newRun => newRun.id === prevRun.id)) {
    //   //     message.success(`${prevRun.type} completed`);
    //   //   }
    //   // })


    //   setQueue(newQueue);

    // });

  const fetchQueueData = async () => {
    const newQueue = await apiClient.getJobsQueue();
    const history = await apiClient.getHistory();
    if (queue) {
      const finishedJobs = (queue as any).filter((job: Job) => !newQueue.find(newQueueJob => newQueueJob.id === job.id));
      finishedJobs.forEach((job: Job) => {
        const historyJob = history.find(x => x.id === job.id);
        if (historyJob && historyJob.error) {
          notification.error({
            message: `${historyJob.type} failed`,
            description: `Error: ${historyJob.error} `,
            placement: 'topRight',
            duration: null
        })
        } else {
          notification.success({
            message: `${job.type} finished`,
            description: `${job.type} finished executing successfully`,
            placement: 'topRight',
            duration: null
        })
        }
          
      })

    }
    setQueue(newQueue);
  }



  useEffect(() => {
    fetchSubjectData();
    fetchCohortData();
    fetchQueueData();
    setInterval(() => {
      fetchSubjectData();
      fetchCohortData();
      fetchQueueData();
    }, 1000)
  
  },[]); 

  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'

  const navigate = useNavigate();

  const contextValue = {
    cohorts,
    subjects,
    selectedSubjects,
    selectedCohorts,
    queue,
    setSelectedCohorts,
    setSelectedSubjects,
    fetchSubjectData,
    fetchCohortData,
    navigate,
    fetchQueueData,
    page: selectedKey
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
                    <Route path="/results" element={<Results />} />
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