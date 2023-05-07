import { Layout, Menu, message } from 'antd';
import {
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import Home from './pages/Home/Home'
import InputData from './pages/InputData/InputData'
import Run from './pages/RunPage/RunPage'
import Qsm from './pages/Qsm/QSM'
import { useNavigate } from 'react-router-dom';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from "react";
import SubjectTree from './components/SubjectTree/SubjectTree';
import CohortTree from './components/CohortTree/CohortTree';
import axios from 'axios';
import { getCohorts, getRuns, getSubjects, postCohorts } from './util/apiClient';
import { Cohorts } from './util/types';
import { SiteContext, context } from './util/context';

const { Header, Content, Footer } = Layout;

const menuItems = [
  {
    key: 'home',
    label: 'Home'
  },
  {
    key: 'inputData',
    label: 'Data'
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
    minHeight: 'calc(100vh - 125px)',  
    maxHeight: 'calc(100vh - 125px)',  
    padding: '24px', 
    background:'#fff',
    width: 'calc(100% - 30px)', 
    marginTop: 15, marginLeft: 15, 
    marginRight: 15, 
  },
  contentBody: { 
    display: 'flex', 
    flexDirection: 'row' as 'row', 
    width: '100%', 
    minHeight: 'calc(100vh - 173px)',
    maxHeight: 'calc(100vh - 173px)' 
  },
  subjectSelector: { 
    width: '300px',  
    minHeight: '100%', 
    border: 2 
  }
}


export default () => {

  const [cohorts, setCohortsState]: [any, any] = useState(null);
  const [subjects, setSubjects]: [any, any] = useState(null);
  const [selectedSubject, setSelectedSubject]: [any, any] = useState(null);
  const [selectedCohort, setSelectedCohort]: [any, any] = useState(null);
  const [ongoingRuns, setOngoingRuns]: [any, any] = useState(null);

  const updateCohorts = (newCohorts: Cohorts) => {
    postCohorts(newCohorts);
    setCohortsState(newCohorts);
  }

  

  useEffect(() => {
    const fetchData = async () => {
      // console.log("Fetching cohort and subject data")
      const promises = await Promise.all([getCohorts(), getSubjects()])
      setCohortsState(promises[0]);
      setSubjects(promises[1]);
    }
    const fetchHistory = async () => {

    }
    const fetchRuns = async () => {
      // console.log("Fetching runs");
      const newRunsList = await getRuns();

      ongoingRuns && ongoingRuns.forEach(prevRun => {
        if (!newRunsList.find(newRun => newRun.id === prevRun.id)) {
          message.success(`${prevRun.description} completed`);
          // TODO - refresh history
        }
      })

      setOngoingRuns(newRunsList);
    }
    fetchData();
    fetchRuns();
    const interval = setInterval(fetchRuns, 5000);
    return () => clearInterval(interval);
  },[]);

  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'

  const navigate = useNavigate();

  const clickSubject = (e: any) => {
    setSelectedSubject(e)
  }

  const clickCohort = (e: any) => {
    setSelectedCohort(e)
  }

  const contextValue = {
    cohorts,
    subjects,
    selectedSubject,
    selectedCohort,
    ongoingRuns
  }

  return (
    <Layout>
      <Header>
        <Menu
          theme="dark"
          mode="horizontal"
          onClick={({ item, key, keyPath, domEvent }) => {
            navigate(`/${key}`)
          }}
          selectedKeys={[selectedKey]}
          items={menuItems}
        />
      </Header>
      <Content style={styles.content}>
        <context.Provider value={contextValue}>
          <div style={styles.contentBody}>
            <div style={styles.subjectSelector}>
              <div style={{ minHeight: '50%', height: '50%' }}>
                <h2>Cohorts</h2>
                <CohortTree cohorts={cohorts} clickCohort={clickCohort} selectedCohort={selectedCohort} />
              </div>
              <div style={{ minHeight: '50%' }}>
                <h2>Subjects</h2>
                <SubjectTree 
                  subjects={subjects}
                  clickSubject={clickSubject}
                />
              </div>
            </div>
            <div style={{ padding: 12}}>
            <Routes>
              <Route path="/home" element={<Home />} />
              <Route path="/run" element={<Run />} />
              <Route path="/inputData" element={
                  <InputData 
                    cohorts={cohorts}
                    subjects={subjects}
                    selectedCohort={selectedCohort} 
                    selectedSubject={selectedSubject}
                    setCohorts={updateCohorts}
                  />
                } 
              />
              <Route path="/output" element={<Qsm />} />
              <Route
                path="/"
                element={ <Navigate to="/home" /> }
              />
              <Route
                path="/"
                element={ <Navigate to="/home" /> }
              />
            </Routes>  
            </div>
          </div>
        </context.Provider>
      </Content>
      <Footer style={{ textAlign: 'center', padding: 12 }}>Created for ENGG4812 ©2022 Created by Campbell Timm</Footer>
    </Layout>
  )
};
