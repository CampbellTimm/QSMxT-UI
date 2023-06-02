import { Skeleton, Tree, Typography } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';
import React, { useContext, useEffect, useState } from 'react';
import { Page, context } from '../../../util/context';
import { Cohorts } from '../../../types';
import { UserOutlined, UsergroupAddOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;
const { Text } = Typography;

const CohortTree: React.FC<{}> = () => {
  const { cohorts, selectedCohorts, setSelectedCohorts, navigate, page } = useContext(context);

  const [expandedKeys, setExpandedKeys] = useState([]);

  useEffect(() => {
    if (page === Page.YourData || page === Page.Results || page === Page.Home) {
      setSelectedCohorts(selectedCohorts.length ? [selectedCohorts[0]] : []);
    }
    if (page === Page.Run) {
      // setExpandedKeys([])
    }
  }, [page]);

  const selectTreeNode = (selectedCohorts: string[], setSelectedCohorts: (cohorts: string[]) => void, setExpandedKeys: (keys: any) => void, page: Page) => (keys: Key[], info: any) => {
    const selectedKey = info.node.key;
    const [clickedCohort, clickedSubject] = selectedKey.split("&");
    if (page === Page.YourData || page === Page.Results || page === Page.Home) {
      if (!selectedCohorts.find(cohort => cohort === selectedKey)) {
        setSelectedCohorts([clickedCohort]);
        setExpandedKeys([clickedCohort]); 
      } else {
        setSelectedCohorts([]);
        setExpandedKeys([]);
      }
    } else if (page === Page.Run) {
      if (!selectedCohorts.find(cohort => cohort === clickedCohort)) {
        setSelectedCohorts(selectedCohorts.concat(selectedKey));
        setExpandedKeys(selectedCohorts.concat(selectedKey));
      } else {
        setSelectedCohorts(selectedCohorts.filter(selectedCohort => selectedCohort !== selectedKey));
        setExpandedKeys(selectedCohorts.filter(selectedCohort => selectedCohort !== selectedKey));
      }
    }
  }
  
  const onSelect: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohorts, setSelectedCohorts, setExpandedKeys, page);
  const onExpand: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohorts, setSelectedCohorts, setExpandedKeys, page);

  if (!cohorts) {
    return <div style={{ minHeight: 250 }}><Skeleton /></div>
  }

  if (!Object.keys(cohorts as Cohorts).length) {
    return <div  style={{ minHeight: 250 }}>
      <div>
        You currently have no saved Cohorts.<br />
        Go to <a onClick={() => navigate('/yourData')}>Your Data </a>page to create them and link subjects.
      </div>
    </div>
  }

  const treeData = Object.keys(cohorts as Cohorts).map(cohortName => {
    return {
      title: cohortName,
      key: cohortName,
      icon : <UsergroupAddOutlined />,
      children: (cohorts  as Cohorts)[cohortName].subjects.map(subjectName => {
        return {
          title: subjectName,
          key: cohortName + '&' + subjectName,
          isLeaf: true,
          icon: <UserOutlined />
        }
      })
    }
  })
 
  return (
    <DirectoryTree
      multiple
      onSelect={onSelect}
      selectedKeys={selectedCohorts}
      expandedKeys={expandedKeys}
      onExpand={onExpand as any}
    
      treeData={treeData}
      height={250}
      style={{ minHeight: 250 }}
    />
  );
};

export default CohortTree;