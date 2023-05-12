import { Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';
import React from 'react';
import { Cohorts } from '../../../util/types';
import { context } from '../../../util/context';

const { DirectoryTree } = Tree;

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
  const { cohorts, selectedCohort, setSelectedCohort } = React.useContext(context);

  const onSelect: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, setSelectedCohort);
  const onExpand: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, setSelectedCohort);

  if (!cohorts) {
    return <div />
  }

  const treeData = Object.keys(cohorts).map(cohortName => {
    return {
      title: cohortName,
      key: cohortName,
      // @ts-ignore
      children: cohorts[cohortName].map(subjectName => {
        return {
          title: subjectName,
          key: subjectName,
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