import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import React, { useContext, useEffect, useState } from 'react';
import { Page, context } from '../../../util/context';
import { Subject, SubjectsTree } from '../../../types';
import { UserOutlined, SolutionOutlined, ProjectOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;

const SubjectTree: React.FC = () => {
  const { subjects, selectedSubjects, setSelectedSubjects, navigate, page } = useContext(context);
  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (page === Page.YourData || page === Page.Results || page === Page.Home) {
      setSelectedSubjects(selectedSubjects.length ? [selectedSubjects[0]] : []);
    }
    if (page === Page.Run) {
      setExpandedKeys([]);
      setSelectedSubjects(selectedSubjects.map(subject => subject.split('&')[0]))
    }
  }, [page]);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info: any) => {
    const selectedKey = info.node.key;
    const [clickedSubject, clickedSession, clickedRun]: string[] = info.node.key.split("&");
    const sessionKey = `${clickedSubject}&${clickedSession || ''}`;
    const runKey = `${clickedSubject}&${clickedSession || ''}&${clickedRun || ''}`;
    if (page === Page.YourData || page === Page.Home || page === Page.Results) {
      if (clickedRun) {
        // setSelectedSubjects(selectedSubjects);
        if (selectedSubjects.find(selectedSubject => selectedSubject === runKey)) {
          setSelectedSubjects(selectedSubjects);
          setExpandedKeys([clickedRun] as any);
        } else {
          setSelectedSubjects([runKey]);
          setExpandedKeys([clickedSubject, runKey] as any);
        }

        setExpandedKeys([clickedSubject, sessionKey, runKey] as any);
      } else if (clickedSession) {
        if (selectedSubjects.find(selectedSubject => selectedSubject === sessionKey)) {
          setSelectedSubjects([]);
          setExpandedKeys([clickedSubject] as any);
        } else {
          setSelectedSubjects([sessionKey]);
          setExpandedKeys([clickedSubject, sessionKey] as any);

        }
      } else if (clickedSubject) {
        if (selectedSubjects.find(selectedSubject => selectedSubject.split("&")[0] === clickedSubject)) {
          console.log('a')
          setSelectedSubjects([]);
          setExpandedKeys([]);
        } else {
          console.log('b')
          setSelectedSubjects([clickedSubject]);
          setExpandedKeys([clickedSubject] as any);
        }
        

      }
    } else if (page === Page.Run) {
      if (!selectedSubjects.find(subject => subject === clickedSubject)) {
        setSelectedSubjects(selectedSubjects.concat(selectedKey));
      } else {
        setSelectedSubjects(selectedSubjects.filter(selectedSubject => selectedSubject !== selectedKey));
      }
    }
   
   
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
  };

  if (!subjects) {
      return <div style={{ minHeight: 250 }}/>
  }

  if (!(subjects as Subject[]).length) {
    return <div  style={{ minHeight: 250 }}>
      <div 
      // style={{ fontSize: 15 }}
      >
        You currently have no subject data upload into QSMxT.
        Go to <a onClick={() => navigate('/yourData')}>Your Data </a>page to upload data.
      </div>
    </div>
  }

  const data = (subjects as Subject[]).map(({ subject, dataTree }) => {
    return  {
      title: subject,
      key: subject, // @ts-ignore
      icon: <UserOutlined />,
      children: Object.keys(dataTree.sessions).map((sessionName => {
        return {
          title: sessionName,
          key: subject + '&' + sessionName,  // @ts-ignore
          icon: <SolutionOutlined />,
          children: Object.keys(dataTree.sessions[sessionName].runs).map((run) => {
            return  { 
              title: 'run-' + run, 
              key: subject + '&' + sessionName + "&" + run,
              isLeaf: true ,
              icon: <ProjectOutlined />
            }
          }
          )
        }
      }))
    }
  })


  return (
    <DirectoryTree
      multiple
      onSelect={onSelect}
      selectedKeys={selectedSubjects}
      onExpand={onExpand}
      expandedKeys={expandedKeys}
      treeData={data}
      style={{ minHeight: 250 }}
    />
  );
};

export default SubjectTree;