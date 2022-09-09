import { useRef, useEffect } from 'react'
import { Niivue } from '@niivue/niivue'
import React from "react";

const NiiVue = ({ imageUrl }) => {
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
  }, [imageUrl])

  return (
    <canvas ref={canvas as any} height={480} width={640} />
  )
}

export default NiiVue;