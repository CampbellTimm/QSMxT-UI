import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import React from 'react';
import { context } from '../../../util/context';
import { SubjectsTree } from '../../../core/types';

const { DirectoryTree } = Tree;

const SubjectTree: React.FC = () => {
  const { subjects, setSelectedSubject } = React.useContext(context);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    setSelectedSubject(info.node.key as string)
  };

  const onExpand: DirectoryTreeProps['onExpand'] = (keys, info) => {
  };

  if (!subjects) {
      return <div />
  }

  const data = Object.keys(subjects as SubjectsTree).map((subjectName: string) => {
    return  {
      title: subjectName,
      key: subjectName, // @ts-ignore
      children: Object.keys(subjects[subjectName].sessions).map((sessionName => {
        return {
          title: sessionName,
          key: subjectName + '&' + sessionName,  // @ts-ignore
          children: Object.keys(subjects[subjectName].sessions[sessionName].runs).map((run) => {
            return  { 
              title: 'run-' + run, 
              key: subjectName + '&' + sessionName + "&" + run,
              isLeaf: true 
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
      defaultExpandAll
      onSelect={onSelect}
      onExpand={onExpand}
      treeData={data}
    />
  );
};

export default SubjectTree;