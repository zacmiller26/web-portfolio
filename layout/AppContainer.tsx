import React from 'react'

import { useTheme } from '../contexts/theme'
import styles from './AppContainer.module.sass'


interface Props {
  children: React.ReactNode
}

const AppContainer: React.FC<Props> = props => {

  const { theme } = useTheme()

  return (
    <main className={styles.root} data-theme={theme}>
      {props.children}
    </main>
  )
}

export default AppContainer
