import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import React from 'react';
import { Subjects } from '../../util/types';

const { DirectoryTree } = Tree;

interface Props {
  subjects: Subjects,
  clickSubject: any,
}

const SubjectTree: React.FC<Props> = ({ subjects, clickSubject }: Props) => {
  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    clickSubject(info.node.key)
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
  };

  if (!subjects) {
      return <div />
  }

  const data = Object.keys(subjects).map((subjectName: string) => {
    return  {
      title: subjectName,
      key: subjectName,
      children: Object.keys(subjects[subjectName].sessions).map((sessionName => {
        return {
          title: sessionName,
          key: subjectName + '&' + sessionName,
          children: subjects[subjectName].sessions[sessionName].runs.map((run, index) => {
            return  { 
              title: 'run-' + index , 
              key: subjectName + '&' + sessionName + "&" + index,
              isLeaf: true 
            }
          }
          ),
        }
      })),
    }
  })

  return (
    <DirectoryTree
      multiple
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={data}
    />
  );
};

export default SubjectTree;