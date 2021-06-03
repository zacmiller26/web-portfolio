import React from 'react'
import Link from 'next/link'

interface Props {

}

const HomeBtn: React.FC<Props> = props => {
  return (
    <Link href="/">
      &larr;
    </Link>
  )
}

export default HomeBtn
