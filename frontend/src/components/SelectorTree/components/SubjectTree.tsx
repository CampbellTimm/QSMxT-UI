import { Tree } from 'antd';
import type { DirectoryTreeProps } from 'antd/es/tree';
import React, { useContext } from 'react';
import { context } from '../../../util/context';
import { Subject, SubjectsTree } from '../../../types';

const { DirectoryTree } = Tree;

const SubjectTree: React.FC = () => {
  const { subjects, selectedSubject, setSelectedSubject, navigate } = useContext(context);

  const onSelect: DirectoryTreeProps['onSelect'] = (keys, info) => {
    setSelectedSubject(info.node.key as string)
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
      children: Object.keys(dataTree.sessions).map((sessionName => {
        return {
          title: sessionName,
          key: subject + '&' + sessionName,  // @ts-ignore
          children: Object.keys(dataTree.sessions[sessionName].runs).map((run) => {
            return  { 
              title: 'run-' + run, 
              key: subject + '&' + sessionName + "&" + run,
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
      onSelect={onSelect}
      selectedKeys={selectedSubject ? [selectedSubject] : []}
      onExpand={onExpand}
      defaultExpandedKeys={[]}
      treeData={data}
      style={{ minHeight: 250 }}
    />
  );
};

export default SubjectTree;