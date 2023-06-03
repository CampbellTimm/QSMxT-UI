import { useRef, useEffect, useState } from 'react'
import { Niivue } from '@niivue/niivue'
import React from "react";
import { Slider, Typography } from 'antd';
interface Props {
  imageUrl: string,
  type: 'mag' | 'phase' | 'qsm'
}

const { Title } = Typography;

const values: any = {
  'mag': {
    min: 0,
    max: 1500,
    defaultRange: [0, 700],
    increment: 5
  },
  'phase': {
    min: null,
    max: null,
    increment: null,
    defaultRange: [-3.1415, 3.1415]
  },
  'qsm': {
    min: -1,
    max: 1,
    defaultRange: [-.1, .1],
    increment: .01
  }
}

const NiiVue: React.FC<Props> = ({ imageUrl, type }) => {
  const canvas = useRef()
  useEffect(() => {
    const volumeList = [
      {
        url: imageUrl,
      },
    ]
    const nv = new Niivue()
    nv.attachToCanvas(canvas.current)
    nv.loadVolumes(volumeList)
  }, [imageUrl]);

  console.log(values[type] );
  const { max, min, increment, defaultRange } = values[type] as any;

  const [range, setRange] = useState(defaultRange);

  const onChange = (e: any) => {
    console.log(e);
  }

  return (
    <div>
      <Title style={{marginTop: 0}} level={4}>Image Range</Title>
      { type !== 'phase' && (
        <Slider onChange={(range) => setRange(range)} step={increment} range value={range} max={max} min={min} disabled={false} />
      )}
      <div style={{ minHeight: 480 }}>
        <canvas key={imageUrl} ref={canvas as any} height={480} width={640} />
      </div>
      <br />
 
    </div>
  )
}

export default NiiVue;