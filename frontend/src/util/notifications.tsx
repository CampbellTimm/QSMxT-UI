import React from 'react';
import { JobNotification, JobStatus, JobType } from "../types";
import { notification } from 'antd';
import { NavigateFunction } from 'react-router-dom';
import { Page } from './context';

export const handleJobNotification = (jobNotification: JobNotification, navigate: NavigateFunction) => {
  const { job } = jobNotification;
  if (job.status === JobStatus.NOT_STARTED) {
    notification.info({
      message: `${job.type} job added to queue`,
      description: <div>View the queue in the <a onClick={() => {navigate(`/${Page.Run}`)}}>Run Page</a></div>,
      placement: 'topRight',
      duration: 6
    })
  } else if (job.status === JobStatus.COMPLETE) {
    let description = <div />
    if (job.type == JobType.DICOM_SORT) {
      description = (
        <div>
          Dicom conversion will now commence
        </div>
      )
    } else if (job.type == JobType.DICOM_CONVERT || job.type == JobType.BIDS_COPY) {
      description = (
        <div>
          Your subject data is now viewable in the <a onClick={() => {navigate(`/${Page.YourData}`)}}>Your Data Page</a>
        </div>
      )
    } else if (job.type == JobType.QSM) {
      description = (
        <div>
          QSM Images are now viewable in the <a onClick={() => {navigate(`/${Page.Results}`)}}>Results Page</a>
        </div>
      )
    } else if (job.type == JobType.SEGMENTATION) {
      description = (
        <div>
          Analysis results are now viewable in the <a onClick={() => {navigate(`/${Page.Results}`)}}>Results Page</a>
        </div>
      )
    }
    notification.success({
      message: `${job.type} succesfully finished`,
      description,
      placement: 'topRight',
      duration: null
    })
  } else if (job.status === JobStatus.FAILED) {
    notification.error({
      message: `${job.type} failed`,
      description: (
        <div>
          <a onClick={() => {navigate(`/${Page.Results}?openView=history&openJob=${job.id}`)}}>View the Logs</a> to determine the cause
        </div>
      ),
      placement: 'topRight',
      duration: null
    })
  }
}