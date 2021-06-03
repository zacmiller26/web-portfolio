import React, { useCallback, useMemo, useRef } from 'react'

import {
  HandleTalentClickProps,
  TalentInfoType
} from '../types'

import useTalentUtils, { TalentDataType } from '../hooks/useTalentUtils'
import { TalentPathsType } from '../hooks/useTreePaths'

interface Props {
  isMobile: boolean
  editable: boolean
  handleTalentClick: (props: HandleTalentClickProps) => void
  buildCode: string
  treeIndex: number
  classSlug: string
  y: number
  x: number
  talentData: TalentDataType
  talentPaths: TalentPathsType
}

const Talent: React.FC<Props> = props => {

  const { classSlug, talentData, buildCode, x, y, treeIndex } = props
  const ref = useRef<HTMLAnchorElement | null>(null)

  const { makeTalentData } = useTalentUtils({
    buildCode,
    classSlug
  })

  const pathClasses = useMemo(() : string => {
    let classes: string[] = []
    props.talentPaths.map((pathData) => {
      if(pathData[0] === y && pathData[1] === x) {
        classes.push(...pathData[2])
      }
    })
    return classes.join(' ')
  }, [x, y, props.talentPaths])

  const talent = useMemo(() : TalentInfoType => {
    return makeTalentData({talentData, treeIndex, y, x})
  }, [y, x, treeIndex, makeTalentData])

  const icon = useMemo(() => (
    `./talent-assets/`+
    `${props.classSlug}-${props.treeIndex}-${props.y}-${props.x}.webp`
  ), [props.classSlug, props.treeIndex, props.x, props.y])


  const wowheadAttr = useMemo(() => (
    `spell=${talent.rank}&domain=tbc`
  ), [talent])

  const refreshTooltip = useCallback(() => {
    if(props.editable) {
      const fire_document_event = (el: HTMLAnchorElement, action: string) => {
        const evObj = document.createEvent( 'Events' );
        evObj.initEvent( action, true, false );
        el.dispatchEvent( evObj );
      }
      if(ref && ref.current) {
        const el = ref.current
        fire_document_event(el, "mouseout")
        fire_document_event(el, "mouseover")
      }
    }
  }, [ref, props.editable])

  return (
    <div className="talent" data-has-points={talent.points > 0}>

      <div className={`paths ${pathClasses}`}><i /><i /><i /><i /></div>

      <div className="talentBackdrop">
        {!talent.isBlank &&
          <a
            ref={ref}
            href="#"
            onContextMenu={(e) => {
              refreshTooltip();
              props.handleTalentClick({e, ...talent})
            }}
            onClick={(e) => {
              refreshTooltip(); props.handleTalentClick({e, ...talent})
            }}
            data-blank={talent.isBlank}
            style={{ backgroundImage: !talent.isBlank ? `url(${icon})` : undefined }}
            data-has-points={(talent.points > 0)}
            data-max-points={talent.points === talent.maxPoints}
            data-wowhead={props.editable && props.isMobile ? '' : wowheadAttr}
          >
            <i />
            <span className="points">{talent.points}/{talent.maxPoints}</span>
          </a>
        }
      </div>

    </div>
  )

}

export default Talent
