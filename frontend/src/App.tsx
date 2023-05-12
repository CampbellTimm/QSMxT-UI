import { Layout, Menu, message } from 'antd';
import {
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import Home from './pages/Home/Home'
import YourDataPage from './pages/YourDataPage/YourDataPage'
import Run from './pages/RunPage/RunPage'
import Qsm from './pages/Qsm/QSM'
import { useNavigate } from 'react-router-dom';
import React, { useEffect, useState } from "react";
import apiClient from './util/apiClient';
import { context } from './util/context';
import SelectorTree from './components/SelectorTree/SelectorTree';

const { Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: 'home',
    label: 'Home'
  },
  {
    key: 'yourData',
    label: 'Your Data'
  },
  {
    key: 'run',
    label: 'Run'
  },
  {
    key: 'output',
    label: 'Results'
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
  }
}

export default () => {
  const [cohorts, setCohorts]: [any, any] = useState(null);
  const [subjects, setSubjects]: [any, any] = useState(null);
  const [selectedSubject, setSelectedSubject]: [any, any] = useState(null);
  const [selectedCohort, setSelectedCohort]: [any, any] = useState(null);
  const [ongoingRuns, setOngoingRuns]: [any, any] = useState(null);

  const fetchSubjectData = async () => {
    const subjects = await apiClient.getSubjects()
    setSubjects(subjects);
  }

  const fetchCohortData = async () => {
    const cohorts = await apiClient.getCohorts();
    setCohorts(cohorts);
  }

  const fetchHistory = async () => {
      // TODO
  }

  useEffect(() => {
    const fetchRuns = async () => {
      // console.log("Fetching runs");
      const newRunsList = await apiClient.getRuns();

      ongoingRuns && ongoingRuns.forEach(prevRun => {
        if (!newRunsList.find(newRun => newRun.id === prevRun.id)) {
          message.success(`${prevRun.description} completed`);
          // TODO - refresh history
        }
      })

      setOngoingRuns(newRunsList);
    }
    fetchSubjectData();
    fetchCohortData();
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000); // TODO - socket???
    return () => clearInterval(interval);
  },[]);

  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'

  const navigate = useNavigate();

  const contextValue = {
    cohorts,
    subjects,
    selectedSubject,
    selectedCohort,
    ongoingRuns,
    setSelectedCohort,
    setSelectedSubject,
    fetchSubjectData,
    fetchCohortData
    // setCohorts: updateCohorts
  }

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={({ key }) => {
            navigate(`/${key}`)
          }}
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Header>
      <Content style={styles.content}>
        <context.Provider value={contextValue as any}>
          <div style={styles.contentBody}>
            <SelectorTree />
            <div style={{ overflowY: 'scroll', width: '100%', paddingRight: 14 }}>
              <Routes>
                <Route path="/home" element={<Home />} />
                <Route path="/run" element={<Run />} />
                <Route path="/yourData" element={<YourDataPage />} />
                <Route path="/output" element={<Qsm />} />
                <Route path="/" element={ <Navigate to="/home" /> }/>
                <Route path="/" element={ <Navigate to="/home" /> } />
              </Routes>  
            </div>
          </div>
        </context.Provider>
      </Content>
    </Layout>
  )
};
