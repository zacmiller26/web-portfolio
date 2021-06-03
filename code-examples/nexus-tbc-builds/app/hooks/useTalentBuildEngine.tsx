import { useCallback, useEffect, useMemo } from 'react'
import { HandleTalentClickProps, TalentInfoType } from '../types'

import useTalentUtils from './useTalentUtils'

interface Props {
  editable: boolean
  appData: any
  wowClass: string
  buildCode: string
  setBuildCode: Function
}

export default function useTalentBuildEngine(props: Props) {

  const { appData, wowClass, buildCode, setBuildCode } = props

  const maxPoints = useMemo(() => appData.max_points, [])
  //const minLevel = useMemo(() => appData.min_level, [])
  //const max_level = useMemo(() => appData.max_level, [])
  //const trees = useMemo(() => appData.trees, [])
  const maxTiers = useMemo(() => appData.classes[wowClass].tree0.talents.length, [])
  const maxRows = useMemo(() => appData.classes[wowClass].tree0.talents[0].length, [])
  const maxTalents = useMemo(() => maxTiers * maxRows, [maxRows, maxTiers])

  const { makeTalentData } = useTalentUtils({
    classSlug: wowClass,
    buildCode
  })

  const createBuildCode = useCallback((code: string) => {
    let build: any = []
    let strs: any = []
    let trees = code.split(':')
    appData.trees.forEach((_tree: string, index: number) => {
      build[index] = []
      let talents = index in trees ? trees[index].split('') : []
      for (let i = 0; i < maxTalents; i++) {
        if(typeof talents[i] !== 'undefined') {
          build[index][i] = Number(talents[i])
        } else {
          build[index][i] = 0
        }
      }
      strs[index] = build[index].join('')
    })

    return strs.join(":")
  }, [maxTalents])

  useEffect(() => {
    /* take buildCode and return full proper buildStr with blank 0000's etc.,
    */
    const newBuildCode = createBuildCode(buildCode)
    if(newBuildCode !== buildCode) setBuildCode(newBuildCode)
  }, [buildCode, setBuildCode, createBuildCode])

  const getTotalPointsInTree = useCallback(
    (treeIndex: number, buildCodeParam?: string) => {

    let code;
    if(buildCodeParam) code = buildCodeParam
    else code = buildCode

    const trees = code.split(':')
		if(treeIndex in trees) {
			const tree = trees[treeIndex].split('')
	    const tree_ints = tree.map(function (x) {
	      return parseInt(x, 10);
	    })
	    const points = tree_ints.reduce((a, b) => a + b, 0)
			if(points) {
				return points
			}
		}
    return 0
  }, [buildCode])

  const getTreeIndexWithMostPoints = useCallback((buildCode: string) : 0 | 1 | 2 => {

    const getIndexOfMax = (arr: number[]) : 0 | 1 | 2 => {
      if (arr.length === 0) return 0;
      var max = arr[0];
      var maxIndex = 0;
      for (var i = 1; i < arr.length; i++) {
          if (arr[i] > max) {
              maxIndex = i;
              max = arr[i];
          }
      }
      if(maxIndex === 0 || maxIndex === 1 || maxIndex === 2) {
        return maxIndex
      }
      return 0;
    }

    const trees = [0,1,2]
		const points = [0,0,0]
		trees.map(tree_index => {
			points[tree_index] = getTotalPointsInTree(tree_index, buildCode)
		})

    return getIndexOfMax(points)

  }, [])

  const totalBuildPoints = useMemo(() => {
    const tree0 = getTotalPointsInTree(0)
    const tree1 = getTotalPointsInTree(1)
    const tree2 = getTotalPointsInTree(2)
    return (tree0+tree1+tree2)
  }, [getTotalPointsInTree])

  const isBuildPointsCapped = useMemo(() => {
    return totalBuildPoints >= maxPoints
  }, [maxPoints, totalBuildPoints])

  const getTotalPointsDownToTier = useCallback((tree_num, y) => {
    let points = 0;
    const build = buildCode.split(':')
    if(tree_num in build) {
      let talents = build[tree_num].split('')
      talents.forEach((p, i) => {
        if(Number(p) > 0) {
          let tier = Math.ceil((i+1)/4)-1
          if(tier <= Number(y)) {
            points += Number(p)
          }
        }
      })
    }
    return points
  }, [buildCode])

  const hasPointsAtOrBelowTier = useCallback((tree_num, y) => {
    let has_points = false;
    const build = buildCode.split(':')
    if(tree_num in build) {
      let talents = build[tree_num].split('')
      talents.forEach((p, i) => {
        if(Number(p) > 0) {
          let tier = Math.ceil((i+1)/4)-1
          if(tier >= Number(y)) {
            has_points = true
          }
        }
      })
    }
    return has_points
  }, [buildCode])

  const isDependedOnInHigherTiers = useCallback((talent: TalentInfoType) => {
    const next_y = talent.y + 1
    if(next_y <= maxTiers-1) {
      if(hasPointsAtOrBelowTier(talent.treeIndex, next_y)) {
        const pts = getTotalPointsDownToTier(talent.treeIndex, talent.y)
        const req = (talent.y+1) * 5
        return (pts-1) < req
      }
    }
    return false
  }, [maxTiers, hasPointsAtOrBelowTier, getTotalPointsDownToTier])

  const talentIsAtPointsMinimum = useCallback((talent: TalentInfoType) => {
    const req = talent.y * 5
    const points = getTotalPointsInTree(talent.treeIndex)
    return req <= points ? true : false
  }, [getTotalPointsInTree])

  const isValidTalentClick = useCallback((talent: TalentInfoType) => {
    const new_val = talent.points + 1;
    // must be below talent max
    if(new_val <= talent.maxPoints) {
      if(talentIsAtPointsMinimum(talent)) {
        if(!isBuildPointsCapped) {
          if(talent.link) {
            const linkData = talent.getLinkData()
            if(linkData) {
              return linkData.isAtMaxPoints
            }
          } else {
            return true
          }
        }
      }
    }
    return false
  }, [talentIsAtPointsMinimum, isBuildPointsCapped])

  const isValidTalentUnclick = useCallback((talent: TalentInfoType) => {
    if(talent.points - 1 >= 0) {
      if(!talent.isDependedOn) {
        if(!isDependedOnInHigherTiers(talent)) {
          return true
        }
      }
    }
    return false
  }, [isDependedOnInHigherTiers])

  const isValidTalentChangeRequest = useCallback(
    (amount: number, talentProps: TalentInfoType) : boolean => {
    if(amount < 0) return isValidTalentUnclick(talentProps)
    return isValidTalentClick(talentProps)
  }, [makeTalentData, isValidTalentClick, isValidTalentUnclick])

  const updateBuildCode = useCallback(
    (amount: number, talentProps: TalentInfoType) => {

    const { treeIndex } = talentProps

    if(isValidTalentChangeRequest(amount, talentProps)) {
      let trees = buildCode.split(':')
      let tree: string[] = trees[treeIndex].split('')
      // update talent points
      const newPoints = talentProps.points + amount
      if(Number(newPoints) >= 0 && newPoints <= talentProps.maxPoints) {
        // update in tree
        tree[talentProps.pos] = newPoints.toString()
        // join back for str
        trees[treeIndex] = tree.join('')
        // update this.build_code
        const newBuildCode = trees.join(":")
        // update
        setBuildCode(newBuildCode)
      }
    }

  }, [buildCode, setBuildCode])

  const handleTalentClick = useCallback(
    (clickProps: HandleTalentClickProps) => {

    const { e, ...talentProps } = clickProps
    e.preventDefault();
    if(props.editable) {
      if (e.type === 'contextmenu') {
        updateBuildCode(-1, {...talentProps})
      } else {
        updateBuildCode(1, {...talentProps})
      }
    }

  }, [updateBuildCode, props.editable])

  const isTreeTierAvailable = useCallback((treeIndex: number, y: number) => {
    const min = y * 5;
    const points = getTotalPointsInTree(treeIndex)
    return points >= min
  }, [buildCode])

  const resetBuild = useCallback(() => {
    setBuildCode(createBuildCode(':::'))
  }, [createBuildCode])

  return {
    getTotalPointsInTree,
    getTreeIndexWithMostPoints,
    isBuildPointsCapped,
    isTreeTierAvailable,
    handleTalentClick,
    totalBuildPoints,
    resetBuild,
    maxPoints
  }

}
