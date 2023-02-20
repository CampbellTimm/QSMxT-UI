import { Tree } from 'antd';
import type { DataNode, DirectoryTreeProps } from 'antd/es/tree';
import { Key } from 'antd/lib/table/interface';
import React from 'react';
import { Cohorts } from '../../util/types';

const { DirectoryTree } = Tree;

interface Props {
  cohorts: Cohorts,
  clickCohort: any,
  selectedCohort: string
}

const selectTreeNode = (selectedCohort, clickCohort) => (keys: Key[], info: any) => {
  if (info.node.key !== selectedCohort) {
    clickCohort(info.node.key)
  } else {
    clickCohort(null);
  }
}

const CohortTree: React.FC<Props> = ({ cohorts, clickCohort, selectedCohort }: Props) => {
  const onSelect: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, clickCohort);
  const onExpand: DirectoryTreeProps['onSelect'] = selectTreeNode(selectedCohort, clickCohort);

  if (!cohorts) {
    return <div />
  }

  const treeData = Object.keys(cohorts).map(cohortName => {
    return {
      title: cohortName,
      key: cohortName,
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