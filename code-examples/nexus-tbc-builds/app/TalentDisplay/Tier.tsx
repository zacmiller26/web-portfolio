import React, { useMemo } from 'react'
import Talent from './Talent'

import { HandleTalentClickProps } from '../types'
import { TalentPathsType } from '../hooks/useTreePaths'

interface Props {
  isMobile: boolean
  editable: boolean
  handleTalentClick: (props: HandleTalentClickProps) => void
  buildCode: string
  y: number
  tierData: any
  treeIndex: number
  classSlug: string
  talentPaths: TalentPathsType
  isTreeTierAvailable: (treeIndex: number, y: number) => boolean
}

const Tier: React.FC<Props> = props => {

  const isAvailable = useMemo(() => {
    return props.isTreeTierAvailable(props.treeIndex, props.y)
  }, [props.isTreeTierAvailable, props.treeIndex, props.y])

  return (
    <div className="tier" data-available={isAvailable}>
      {props.tierData.map((talent: any, x: number) => (
        <Talent
          isMobile={props.isMobile}
          editable={props.editable}
          key={props.y.toString() + '-' + x.toString()}
          treeIndex={props.treeIndex}
          classSlug={props.classSlug}
          handleTalentClick={props.handleTalentClick}
          buildCode={props.buildCode}
          talentData={talent}
          talentPaths={props.talentPaths}
          x={x}
          y={props.y}
        />
      ))}
    </div>
  )
}

export default Tier
