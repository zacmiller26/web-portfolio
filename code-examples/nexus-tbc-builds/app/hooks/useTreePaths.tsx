import React, { useCallback, useEffect, useState } from 'react'

import useTalentUtils from './useTalentUtils'

export type TalentPathsType = [number, number, string[]][]

interface Props {
  treeData: any
  treeIndex: any
  classSlug: string
  buildCode: string
}

export default function useTreePaths(props: Props) {

  const { buildCode, classSlug, treeIndex } = props

  const [talentPaths, setTalentPaths] = useState<TalentPathsType>([])

  const { makeTalentData, getTalentJsonData } = useTalentUtils({
    buildCode,
    classSlug
  })

  const getPathClasses = useCallback((treeIndex: number, tY: number, tX: number,
    linkY: number, linkX: number, linkActive: boolean, dependeeActive: boolean
  ) => {

    let steps: [number, number][] = []
    let directions: TalentPathsType = []
    // setup y path
    let y_start: number = tY
    let y_end: number = linkY

    // navigate y path
    for (let y_path = y_start; y_path >= y_end; y_path--) {
      steps.push([y_path, tX])
    }

    // setup x path
    let x_start = tX
    let x_end = linkX

    // navigate y path
    for (let x_path = x_start; x_path >= x_end; x_path--) {
      if(!steps.find(s => s[0] === y_end && s[1] === x_path)) {
        steps.push([y_end, x_path])
      }
    }

    // iterate through steps
    steps.forEach((coords, i) => {

      let classes = []
      let y = coords[0]
      let x = coords[1]

      if(steps.find(c => c[0] === y && c[1] === x-1)) classes.push('left')
      if(steps.find(c => c[0] === y && c[1] === x+1)) classes.push('right')
      if(steps.find(c => c[1] === x && c[0] === y-1)) classes.push('up')
      if(steps.find(c => c[1] === x && c[0] === y+1)) classes.push('down')

      classes.map(c => {
        if(linkActive && dependeeActive) {
          classes.push(`${c}-active`)
        } else if(linkActive) {
          classes.push(`${c}-progress`)
        }
      })

      // add step to directions
      directions.push([y, x, classes])
    })

    return directions
  }, [])

  useEffect(() => {
    let pathDirections: TalentPathsType = []
    props.treeData.talents.forEach((tier: any, y: number) => (
      tier.forEach((talentData: any, x: number) => {
        if(talentData[2]) {
          const t = makeTalentData({ treeIndex, y, x, talentData })
          if(t.link) {
            const linkData = getTalentJsonData(treeIndex, t.link.y, t.link.x)
            const l = makeTalentData({
              treeIndex,
              y: t.link.y,
              x: t.link.x,
              talentData: linkData
            })
            const directions = getPathClasses(
              treeIndex,
              y,
              x,
              t.link.y,
              t.link.x,
              l.isAtMaxPoints,
              t.isActive
            )
            pathDirections.push(...directions)
          }
        }
      })
    ))
    setTalentPaths(pathDirections)
  }, [props.treeData, treeIndex, buildCode, makeTalentData, getPathClasses])

  return {
    talentPaths
  }
}
