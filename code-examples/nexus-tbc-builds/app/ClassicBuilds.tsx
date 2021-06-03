import { useCallback, useEffect, useMemo, useState } from 'react'

import { ComponentProps, NexusDataType } from '../../nexus-emulator'
import appData from './config/data.json'
import Tree from './TalentDisplay/Tree'
import useTalentBuildEngine from './hooks/useTalentBuildEngine'


import { TreeDataType, TreeType } from './types'

export default function ClassicBuilds(props: ComponentProps) {

  const { nexusData: { wow_class, build_code } } = props
  const [tree, setTree] = useState<TreeType>(null)
  const trees = useMemo(() => ["tree0", "tree1", "tree2"], [])

  const setWowClass = useCallback((className: string) => {
    props.setNexusData((prev: NexusDataType) => ({
      ...prev, wow_class: className
    }))
  }, [props.setNexusData])

  const wowClass = useMemo(() => {
    if(wow_class) return wow_class
    return 'rogue'
  }, [wow_class])

  const setBuildCode = useCallback((buildStr: string) => {
    props.setNexusData((prev: NexusDataType) => ({
      ...prev, build_code: buildStr
    }))
  }, [props.setNexusData])

  const buildCode = useMemo(() => {
    if(build_code) return build_code
    return ':::'
  }, [build_code])

  const treeIndex = useMemo(() : number => (
    tree ? Number(tree.replace('tree', '')) : 0
  ), [tree])

  const editable = useMemo(() => props.isEditor, [props.isEditor])

  const {
    isBuildPointsCapped,
    getTotalPointsInTree,
    getTreeIndexWithMostPoints,
    handleTalentClick,
    isTreeTierAvailable,
    resetBuild,
    totalBuildPoints,
    maxPoints
  } = useTalentBuildEngine({
    editable,
    appData,
    buildCode,
    setBuildCode,
    wowClass
  })

  /*useEffect(() => {
    props.setNexusData({
      build_code: buildCode,
      wow_class: wowClass
    })
  }, [buildCode, wowClass, props.setNexusData])*/

  const wowClassTreeData = useMemo((): TreeDataType => {
    const data: any = appData
    return data.classes[wowClass]
  }, [wowClass])

  const setActiveTreeByMostPoints = useCallback((buildCodeParam: string) => {
    if(!props.isEditor) {
      const tIndex = getTreeIndexWithMostPoints(buildCodeParam)
      const tSlug = `tree${tIndex}`
      if(tSlug === "tree0" || tSlug === "tree1" || tSlug === "tree2") {
        setTree(tSlug)
      } else {
        setTree("tree0")
      }
    }
  }, [props.isEditor])

  // reset build if class changes
  useEffect(() => {
    resetBuild()
  }, [wow_class, resetBuild])

  // set active tree by most points on load
  useEffect(() => {
    if(tree === null) setActiveTreeByMostPoints(buildCode)
  }, [tree, buildCode, wowClassTreeData])

  // show default tree whenever form_data.build_code changes
  useEffect(() => {
    if(build_code) setActiveTreeByMostPoints(build_code)
  }, [build_code, setActiveTreeByMostPoints])

  return (
    <div className="root" style={{
        backgroundImage: `url(./talent-assets/${wowClass}-${treeIndex}.webp)`
      }}>
      {editable &&
        <div className="editBuildContainer">
          <div>
            <SelectWowClass
              formSchema={props.formSchema}
               wowClass={wowClass}
               setWowClass={setWowClass}
             />
          </div>
        </div>
      }
      <TreeMenu
        trees={trees}
        setTree={setTree}
        tree={tree}
        wowClass={wowClass}
        wowClassTreeData={wowClassTreeData}
        getTotalPointsInTree={getTotalPointsInTree}
      />
      {Object.keys(wowClassTreeData).map((tree_slug, i) => (
        <div
          key={tree_slug}
          style={{ display: tree === tree_slug ? 'block' : 'none' }}
        >
          <Tree
            isMobile={props.viewer.isMobile}
            isBuildPointsCapped={isBuildPointsCapped}
            treeIndex={i}
            isTreeTierAvailable={isTreeTierAvailable}
            classSlug={wowClass}
            treeData={wowClassTreeData[tree_slug]}
            buildCode={buildCode}
            handleTalentClick={handleTalentClick}
            editable={editable}
          />
        </div>
      ))}
      {editable && <>
        <div className="pointsTracker">
          <span>
            {totalBuildPoints}/{maxPoints}
          </span>
          <button type="button" onClick={resetBuild}>Reset Talents</button>
        </div>
      </>
      }
    </div>
  )

}

const SelectWowClass = (props: { formSchema: any, setWowClass: Function, wowClass: string}) => {

  const { wowClass, setWowClass, formSchema } = props

  return (
    <select
      onChange={(e) => setWowClass(e.currentTarget.value)} value={wowClass}>
      {formSchema.wow_class.choices.map(([slug, label]: [string, string]) => (
        <option key={slug} value={slug}>
          {label}
        </option>
      ))}
    </select>
  )
}

interface TreeMenuProps {
  tree: TreeType
  setTree: Function
  trees: string[]
  wowClassTreeData: any
  wowClass: string
  getTotalPointsInTree: (index: number) => number
}

const TreeMenu = (props: TreeMenuProps) => {
  return (
    <div className="tree-menu">
      {props.trees.map((tree_slug, i) => (
        <button
          key={tree_slug}
          type="button"
          onClick={() => props.setTree(tree_slug)}
          data-active={tree_slug === props.tree}
        >
          <i className="spec-icon" style={{
            backgroundImage: `url(./talent-assets/${props.wowClass}-${i}-icon.webp)`
          }} />
          ({props.getTotalPointsInTree(i)})
        </button>
      ))}
    </div>
  )
}
