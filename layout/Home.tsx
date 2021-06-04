import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ReactCardFlip from 'react-card-flip'
import Link from 'next/link'

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

const PERSON_FNAME = process.env.NEXT_PUBLIC_PERSON_FIRST_NAME
const PERSON_LNAME = process.env.NEXT_PUBLIC_PERSON_LAST_NAME
const PERSON_TITLE = process.env.NEXT_PUBLIC_PERSON_TITLE
const PERSON_TITLE_2 = process.env.NEXT_PUBLIC_PERSON_TITLE_2
const PERSON_EMAIL = process.env.NEXT_PUBLIC_PERSON_EMAIL
const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO

const Home: React.FC = () => {

  const { theme, themes, setTheme } = useTheme()
  const cardRef = useRef<HTMLDivElement | null>(null)
  const [showEmail, setShowEmail] = useState(false)
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
            <h1>{PERSON_FNAME} {PERSON_LNAME}</h1>
            <h2><Age year={1989} /> · Lehi, UT</h2>
            <h4>{PERSON_TITLE}</h4>
            <h5>{PERSON_TITLE_2}</h5>
            <h6>
              {!showEmail ?
                <a href="#" onClick={e => {
                  e.preventDefault(); setShowEmail(true)
                }}>
                  Email Me
                </a> :
                <a href={`mailto:${PERSON_EMAIL}`}>{PERSON_EMAIL}</a>
              }

            </h6>
            <div className={styles.btnMenu}>
              <button type="button" onClick={toggleCard}>
                <InfoIcon />
              </button>
              <Link href="/examples">
                <a><CodeIcon /></a>
              </Link>
              <a href={GITHUB_REPO} target="_blank">
                <GithubIcon />
              </a>
            </div>
          </div>
        </div>
        <div
          className={styles.cardBorder}
          style={{ width: cardSize.width, height: cardSize.height }}
        >
          <div className={styles.card} data-fixed>
            <h3>Hi, I'm {PERSON_FNAME} 😎</h3>
            <p>
              I love setting and chasing big goals, and have challenged
              myself with a variety of them these past 10 years.
              <br /><br />
              💻 📈 🚴🏻‍♂️ 🏍 🏁 🥇 🏆 🍾
              <br /><br />
              Along the way, I've learned a few things about taking
              big ideas and shaping them into reality.
              <br /><br />
              I'm always looking for new opportunities and challenges, and
              would love to bring my drive, experience and curiosity to a fun
              new team or project. Let's get in touch!
            </p>
            <button type="button" onClick={toggleCard}>
              <LarrIcon />
            </button>
          </div>
        </div>
      </ReactCardFlip>

      {/*<div className={styles.navMenu}>
        <Link href="/examples">
          <a>
            <CodeIcon />
          </a>
        </Link>
        <a href="https://github.com/felfire/web-portfolio" target="_blank">
          <GithubIcon />
        </a>
      </div>*/}

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
