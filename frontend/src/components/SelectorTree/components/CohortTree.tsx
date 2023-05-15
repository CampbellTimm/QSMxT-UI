import { Tree, Typography } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';
import React from 'react';
import { context } from '../../../util/context';
import { Cohorts } from '../../../core/types';

const { DirectoryTree } = Tree;
const { Text } = Typography;

interface Props {
  // cohorts: Cohorts,
  // setSelectedCohort: any,
  // selectedCohort: string
}

const selectTreeNode = (selectedCohort, setSelectedCohort) => (keys: Key[], info: any) => {
  if (info.node.key !== selectedCohort) {
    setSelectedCohort(info.node.key)
  } else {
    setSelectedCohort(null);
  }
}

const CohortTree: React.FC<Props> = () => {
  const { cohorts, selectedCohort, setSelectedCohort, navigate } = React.useContext(context);

  const onSelect: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, setSelectedCohort);
  const onExpand: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, setSelectedCohort);

  if (!cohorts) {
    return <div style={{ minHeight: 250 }}/>
  }

  if (!Object.keys(cohorts as Cohorts).length) {
    return <div  style={{ minHeight: 250 }}>
      <div>
        You currently have no saved Cohorts.<br />
        Go to <a onClick={() => navigate('/yourData')}>Your Data </a>page to create them and link subjects.
      </div>
    </div>
  }

  const treeData = Object.keys(cohorts).map(cohortName => {
    return {
      title: cohortName,
      key: cohortName,
      // @ts-ignore
      children: cohorts[cohortName].subjects.map(subjectName => {
        return {
          title: subjectName,
          key: cohortName + '&' + subjectName,
          isLeaf: true
        }
      })
    }
  })
 
  return (
    <DirectoryTree
      multiple
      onSelect={onSelect}
      selectedKeys={selectedCohort ? [selectedCohort] : []}
      defaultSelectedKeys={[]}
      defaultExpandedKeys={[]}
      onExpand={onExpand as any}
      treeData={treeData}
      height={250}
      style={{ minHeight: 250 }}
    />
  );
};

export default CohortTree;