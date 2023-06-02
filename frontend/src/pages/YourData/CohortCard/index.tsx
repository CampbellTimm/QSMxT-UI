import { Typography, Divider } from 'antd';
import React from 'react';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { context } from '../../../util/context';
import { Cohorts, Subject } from '../../../types';
import ViewCohort from './ViewCohort';
import CreateCohort from './CreateCohort';
import ContentCard from '../../../containers/ContentCard';

const { Text } = Typography;

const explanatoryText = () => <Text> 
  <i>Select a Cohort on the left of the screen to view and update OR create a new Cohort...</i>
  <Divider />
</Text>

const cohortHelperText = <Text>
  Cohorts are used to group subjects for the purpose<br />
  of running the QSM pipeline and viewing their results. <br />
  Use the tree on the left of the screen to select cohorts.
</Text>

const CohortCard: React.FC = () => {
  const { selectedCohorts, subjects, cohorts } = React.useContext(context);
  const loading = !subjects || !cohorts;
  return (
    <ContentCard 
      title={'Cohort'} 
      width={530} 
      Icon={UsergroupAddOutlined} 
      helperText={cohortHelperText} 
      loading={loading}
    >
      <div style={{ marginRight: 20}}>
      {explanatoryText()}
      {selectedCohorts.length 
        ? <ViewCohort 
            cohorts={cohorts as Cohorts}
            subjects={subjects as Subject[]}
            selectedCohort={selectedCohorts[0]}
          />
        : <CreateCohort />
      }
      </div>
    </ContentCard>

  )
}

export default CohortCard;