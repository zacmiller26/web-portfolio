import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import Link from 'next/link'
import { Obfuscate } from '@south-paw/react-obfuscate-ts'

import GithubIcon from './icons/github'
import CodeIcon from './icons/code'
import InfoIcon from './icons/info'
import LarrIcon from './icons/larr'
import { useTheme } from '../contexts/theme'
import styles from './Home.module.sass'

type CardSizeType = {
  height: 'inherit' | number
  width: 'inherit' | number
}

const isClient = () => typeof window !== 'undefined'

const Home: React.FC = () => {

  const { theme, themes, setTheme } = useTheme()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [isFlipped, setIsFlipped] = useState<boolean>(false)
  const [cardSize, setCardSize] = useState<CardSizeType>({
    height: 'inherit', width: 'inherit'
  })

  const toggleCard = useCallback(() => setIsFlipped(p => !p), [])

  useEffect(() => {
    if(cardRef && cardRef.current) {
      setCardSize({
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight
      })
    }
  }, [cardRef, isFlipped])

  return (
    <div className={styles.root}>

      {/*<div className={styles.themeToggle}>
        {themes.map((themeOption: string) => (
          <button
            type="button"
            onClick={() => setTheme(themeOption)}
            data-value={themeOption}
            data-active={theme === themeOption}
          />
        ))}
      </div>*/}

      <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
        <div className={styles.cardBorder} ref={cardRef}>
          <div className={styles.card}>
            <div className={styles.avatar}>
              <i />
            </div>
            <h1>Zac Miller</h1>
            <h2><Age year={1989} /> · Lehi, UT</h2>
            <h4>Full Stack Engineer</h4>
            <h5>Expert Superbike Champion</h5>
            <h6>
              {!isClient() && <a href="#">{"emailaddr@domain.com"}</a>}
              <Obfuscate email="zacmiller26@icloud.com" />
            </h6>
            <div className={styles.btnMenu}>
              <button type="button" onClick={toggleCard}>
                <InfoIcon />
              </button>
              {/*<Link href="/examples">
                <a><CodeIcon /></a>
              </Link>
              <a href="https://github.com/felfire/web-portfolio" target="_blank">
                <GithubIcon />
              </a>*/}
            </div>
          </div>
        </div>
        <div
          className={styles.cardBorder}
          style={{ width: cardSize.width, height: cardSize.height }}
        >
          <div className={styles.card} data-fixed>
            <h3>Hi, I'm Zac 😎</h3>
            <p>
              I love chasing after goals and dreams, and have pursued quite a
              few over the past 12 years.
              <br /><br />
              💻 📈 🚴🏻‍♂️ 🏍 🏁 🥇 🏆 🍾
              <br /><br />
              Along the way, I've learned a few things about taking
              big ideas and shaping them into reality.
              <br /><br />
              With much more to pursue &amp; learn, I think
              playing a role in your teams future accomplishments would be an
              excellent way of doing so!
            </p>
            <button type="button" onClick={toggleCard}>
              <LarrIcon />
            </button>
          </div>
        </div>
      </ReactCardFlip>

      {<div className={styles.navMenu}>
        <Link href="/examples">
          <a>
            <CodeIcon />
          </a>
        </Link>
        <a href="https://github.com/felfire/web-portfolio" target="_blank">
          <GithubIcon />
        </a>
      </div>}

    </div>

  )
}

const Age = ({ year }: { year: number }) => {

  const age = useMemo(() : number => {
    var ageDifMs = Date.now() - year
    var ageDate = new Date(ageDifMs)
    return Math.abs(ageDate.getUTCFullYear() - 1989)
  }, [year])

  return <React.Fragment>{age}</React.Fragment>

}

export default Home
