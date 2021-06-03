import React from 'react'
import Tier from './Tier'

import { HandleTalentClickProps } from '../types'
import useTreePaths from '../hooks/useTreePaths'

interface Props {
  isMobile: boolean
  editable: boolean
  isBuildPointsCapped: boolean
  handleTalentClick: (props: HandleTalentClickProps) => void
  buildCode: string
  treeData: any
  treeIndex: number
  classSlug: string
  isTreeTierAvailable: (treeIndex: number, y: number) => boolean
}

const Tree: React.FC<Props> = props => {

  const { buildCode, classSlug, treeIndex, treeData } = props
  const { talentPaths } = useTreePaths({
    classSlug,
    buildCode,
    treeIndex,
    treeData
  })

  return (
    <div
      className="tree"
      data-locked={!props.editable ? true : props.isBuildPointsCapped}>

      <div className="treeBg" style={{
          //backgroundImage: `url(./talent-assets/${classSlug}-${treeIndex}.webp)`
        }}
      />

      {treeData.talents.map((tier: any, y: number) => (
        <Tier
          isMobile={props.isMobile}
          editable={props.editable}
          treeIndex={treeIndex}
          classSlug={classSlug}
          handleTalentClick={props.handleTalentClick}
          buildCode={buildCode}
          tierData={tier}
          talentPaths={talentPaths}
          isTreeTierAvailable={props.isTreeTierAvailable}
          y={y}
          key={y.toString() + '-' + treeIndex.toString()}
        />

      ))}
    </div>
  )
}

export default Tree
