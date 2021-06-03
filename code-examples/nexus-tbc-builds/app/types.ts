export type TalentNameType = string | undefined
export type TalentRanksType = string[] | undefined
export type TalentLinkType = { y: number, x: number } | undefined
export type TalentDependeeType = TalentLinkType
export type TalentDataType = [TalentNameType,TalentRanksType,TalentLinkType]

export type TierDataType = [
  TalentDataType[]
]

export type TreeType = null | "tree0" | "tree1" | "tree2"

export interface TreeDataType {
  [key: string]: {
    label: string
    talents: TierDataType
  }
}

export interface TalentInfoType {
  treeIndex: number
  x: number
  y: number
  pos: number
  link: TalentLinkType
  getLinkData: () => TalentInfoType | undefined
  dependee: TalentDependeeType
  name: TalentNameType
  ranks: TalentRanksType
  rank: string
  points: number
  maxPoints: number
  isActive: boolean
  isBlank: boolean
  isDependedOn: boolean
  isAtMaxPoints: boolean
}

export interface HandleTalentClickProps extends TalentInfoType {
  e: React.MouseEvent
}
