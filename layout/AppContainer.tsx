import React, { useMemo } from 'react'

import { useTheme } from '../contexts/theme'
import useMobileDetect from '../hooks/useMobileDetect'
import styles from './AppContainer.module.sass'


interface Props {
  children: React.ReactNode
}

const AppContainer: React.FC<Props> = props => {

  const { theme } = useTheme()
  const mobileDetect = useMobileDetect()

  const isMobile = useMemo(() => mobileDetect.isMobile(), [mobileDetect])

  return (
    <main
      className={styles.root}
      data-theme={theme}
      data-mobile={isMobile ? 'true' : 'false'}
    >
      {props.children}
    </main>
  )

}

export default AppContainer
