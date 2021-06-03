import React, { useCallback, useEffect, useState } from 'react'

import { TalentInfoType, TalentDependeeType, TalentLinkType } from '../types'
import appData from '../config/data.json'

interface Props {
  classSlug: string
  buildCode: string
}

export type TalentDataType = [
  string | undefined, // name
  string[] | undefined, // rank spell ids
  [number, number] | undefined // link coords (y,x)
]

interface TalentProps {
  talentData: TalentDataType
  treeIndex: number
  y: number
  x: number
}

export default function useTalentUtils(props: Props) {

  const { buildCode, classSlug } = props

  const getTalentPoints = useCallback((treeIndex: number, pos: number) => {
    const trees = buildCode.split(':')
    if(trees && trees[treeIndex]) {
      if(trees[treeIndex][pos]) {
        return Number(trees[treeIndex][pos])
      }
    }
    return 0
  }, [buildCode])

  const getTalentRank = useCallback((ranks: TalentDataType[1], points: number) => {
    if(ranks) {
      if(points === 0) return ranks[0]
      else if(ranks.length >= points-1 ) return ranks[ points-1 ]
    }
    return ''
  }, [])

  const getTalentJsonData = useCallback((treeIndex, y, x) => {
    const data: any = appData
    const tree = `tree${treeIndex}`
    return data.classes[classSlug][tree].talents[y][x]
  }, [classSlug])

  const makeTalentData = useCallback((tProps: TalentProps) : TalentInfoType => {

    const { talentData, treeIndex, y, x } = tProps
    const pos = getTalentPos(y, x)
    const points = getTalentPoints(treeIndex, pos)
    const maxPoints = getTalentMaxPoints(talentData)
    const dependee = getTalentDependee(classSlug, treeIndex, y, x)
    const link = getTalentLink(talentData)
    const ranks = getTalentRanks(talentData)

    return {
      isActive: (points >= 1),
      isBlank: (talentData.length <= 0),
      isDependedOn: getIsTalentDependedOn(treeIndex, dependee),
      isAtMaxPoints: (points === maxPoints),
      name: getTalentName(talentData),
      rank: getTalentRank(ranks, points),
      getLinkData: () => getTalentLinkData(treeIndex, link),
      ranks,
      link,
      dependee,
      points,
      maxPoints,
      pos,
      x,
      y,
      treeIndex,
    }

  }, [buildCode, classSlug, getTalentPoints])

  const getTalentDependee = useCallback((classSlug, treeIndex, y, x) => {

    let dependee = undefined;
    const data: any = appData
    const tree = `tree${treeIndex}`
    data.classes[classSlug][tree].talents.map((tier: any, nY: number) => {
      return tier.find((talent: any, nX: number) => {
        if(talent[2] && talent[2][0] === y && talent[2][1] === x) {
          dependee = { y: nY, x: nX }
          return true
        }
      })
    })

    return dependee

  }, [])

  const getTalentLinkData = useCallback(
    (treeIndex: number, link: TalentLinkType) => {

    if(link) {
      const jsonData = getTalentJsonData(treeIndex, link.y, link.x)
      return makeTalentData({
        talentData: jsonData,
        treeIndex,
        y: link.y,
        x: link.x
      })
    }
    return undefined

  }, [getTalentJsonData, makeTalentData])

  const getIsTalentDependedOn = useCallback(
    (treeIndex: number, dependee: TalentDependeeType) => {

    if(dependee) {
      const jsonData = getTalentJsonData(treeIndex, dependee.y, dependee.x)
      const talentData = makeTalentData({
        talentData: jsonData,
        treeIndex,
        y: dependee.y,
        x: dependee.x
      })
      return (talentData.points > 0)
    }
    return false

  }, [getTalentJsonData, makeTalentData])

  const getTalentLink = useCallback((talentData: TalentDataType) => {
    if(talentData[2]) {
      return {
        y: talentData[2][0],
        x: talentData[2][1],
      }
    }
    return undefined
  }, [])

  const getTalentRanks = useCallback((talentData: TalentDataType) => {
    if(talentData[1]) {
      return talentData[1]
    }
    return undefined
  }, [])

  const getTalentName = useCallback((talentData: TalentDataType) => {
    if(talentData[0]) {
      return talentData[0]
    }
    return undefined
  }, [])

  const getTalentMaxPoints = useCallback((talentData: TalentDataType) => {
    if(talentData[1]) return talentData[1].length
    return 0
  }, [])

  const getTalentPos = useCallback((y: number, x: number) => {
    return (y * 4) + x
  }, [])

  return {
    makeTalentData,
    getTalentJsonData
  }

}
