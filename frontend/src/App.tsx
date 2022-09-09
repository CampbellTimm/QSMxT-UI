
import { Breadcrumb, Layout, Menu } from 'antd';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate 
} from "react-router-dom";
import Home from './pages/Home'
import InputData from './pages/InputData'
import Qsm from './pages/Qsm'
import { useNavigate } from 'react-router-dom';
import './App.css';
import 'antd/dist/antd.css';
import React from "react";

const { Header, Content, Footer } = Layout;


const routes = <Routes>
  <Route path="/home" element={<Home />} />
  <Route path="/inputData" element={<InputData />} />
  <Route path="/output" element={<Qsm />} />
  <Route
    path="/"
    element={ <Navigate to="/home" /> }
  />
</Routes>  


export default () => {

  console.log(window.location.pathname);

  const selectedKey = window.location.pathname.split('/')[window.location.pathname.split('/').length - 1] || 'home'
  console.log(selectedKey);

  // const OnClick = ({ item, key, keyPath, domEvent }) => {
  // }

  const navigate = useNavigate();


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
            label: 'Input Data'
          },
          {
            key: 'output',
            label: 'Output'
          },
        ]}
      />
    </Header>
    <Content style={{ padding: '0 50px' }}>
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>List</Breadcrumb.Item>
        <Breadcrumb.Item>App</Breadcrumb.Item>
      </Breadcrumb>
      <div className="site-layout-content">
        {routes}
      </div>
      
    </Content>
    <Footer style={{ textAlign: 'center' }}>Created for ENGG4812 ©2022 Created by Campbell Timm</Footer>
  </Layout>
  )
};
