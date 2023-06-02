import { Input, Typography, Button, Form } from 'antd';
import React, { useContext, useState } from 'react';
import { context } from '../../../util/context';
import apiClient from '../../../util/apiClient';

const { Title } = Typography;

const CreateCohort: React.FC = () => {
  const { setSelectedCohorts, fetchCohortData } = useContext(context);
  const [creating, setCreating]: [boolean, any] = useState(false);

  const createCohort = async (cohortName: string, cohortDescription: string) => {
    setCreating(true);
    const created = await apiClient.createCohort(cohortName, cohortDescription);
    setCreating(false);
    if (created) {
      await fetchCohortData();
      setSelectedCohorts([cohortName]);
    }
  }

  return (
    <>
      <Title level={5}>Create A New Cohort</Title>
      <Form
        name="cohortCreation"
        onFinish={({cohortName, cohortDescription}) => createCohort(cohortName, cohortDescription)}
        autoComplete="off"
      >
        {/* Cohort Name */}
        <Form.Item
          name="cohortName"
          rules={[{ required: true, message: 'Please input the cohort name' }]}
          label="Cohort Name"
        >
          <Input
            placeholder="Enter a cohort name..."
          />
        </Form.Item>
        {/* Description */}
        <Form.Item
          name="cohortDescription"
          rules={[{ required: true, message: 'Please input the description for the cohort' }]}
          label="Description"
        >
          <Input
            placeholder="Enter a cohort description..."
          />
        </Form.Item>
        <Form.Item >
          <Button style={{ width: '100%' }} loading={creating} type="primary" htmlType="submit">
            Create
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

export default CreateCohort;