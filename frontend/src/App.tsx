
import { Layout, Menu, message } from 'antd';
import {
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import Home from './pages/Home/Home'
import InputData from './pages/InputData/InputData'
import Run from './pages/Run/Run'
import Qsm from './pages/Qsm/QSM'
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import React, { useEffect, useState } from "react";
import SubjectTree from './components/SubjectTree/SubjectTree';
import CohortTree from './components/CohortTree/CohortTree';
import axios from 'axios';
import { getCohorts, getRuns, getSubjects, postCohorts } from './util/apiClient';
import { Cohorts } from './util/types';

const { Header, Content, Footer } = Layout;


export default () => {

  const [cohorts, setCohortsState]: [any, any] = useState(null);
  const [subjects, setSubjects]: [any, any] = useState(null);
  const [selectedSubject, setSelectedSubject]: [any, any] = useState(null);
  const [selectedCohort, setSelectedCohort]: [any, any] = useState(null);
  const [ongoingRuns, setOngoingRuns]: [any, any] = useState([]);

  const updateCohorts = (newCohorts: Cohorts) => {
    postCohorts(newCohorts);
    setCohortsState(newCohorts);
  }

  useEffect(() => {
    const fetchData = async () => {
      console.log("Fetching cohort and subject data")
      const promises = await Promise.all([getCohorts(), getSubjects()])
      setCohortsState(promises[0]);
      setSubjects(promises[1]);
    }
    const fetchRuns = async () => {
      console.log("Fetching runs");
      const newRunsList = await getRuns();

      ongoingRuns.forEach(prevRun => {
        if (!newRunsList.find(newRun => newRun.id === prevRun.id)) {
          message.success(`${prevRun.description} completed`);
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

  return (
    <Layout className="layout">
    <Header>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="horizontal"
        onClick={({ item, key, keyPath, domEvent }) => {
          navigate(`/${key}`)
        }}
        selectedKeys={[selectedKey]}
        items={[
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
        ]}
      />
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <br />
      <div className="site-layout-content">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div style={{ width: '300px',  height: 'calc(100vh - 200px)' }}>
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
            <Route path="/run" element={
              <Run 
                ongoingRuns={ongoingRuns}
                cohorts={cohorts}
                subjects={subjects}
              />
              } 
            />
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
          </Routes>  

          </div>

        </div>

      </div>
      
    </Content>
    <Footer style={{ textAlign: 'center' }}>Created for ENGG4812 ©2022 Created by Campbell Timm</Footer>
  </Layout>
  )
};
