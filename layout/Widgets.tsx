import React, { useState } from 'react'

import NexusTBCBuild from '../code-examples/nexus-tbc-builds'
import NexusBasicTable from '../code-examples/nexus-basic-table'
import HomeBtn from './HomeBtn'
import styles from './Widgets.module.sass'

const GITHUB_REPO = process.env.NEXT_PUBLIC_GITHUB_REPO

const Widgets: React.FC = () => {

  const [widget, setWidget] = useState('')

  return (
    <div className={styles.root}>
      <div className={styles.backBtn}>
        <HomeBtn />
      </div>
      <div className={styles.widgetNav}>
        <select onChange={e => setWidget(e.currentTarget.value)}>
          <option value=''>-- Select Widget --</option>
          <option value='builds'>Game Widget</option>
          <option value='tables'>Table Widget</option>
        </select>
      </div>
      <div className={styles.widgetDisplay}>
        {widget === '' && <NexusWidgetsNote />}
        {widget === 'tables' && <><NexusTableNote /><NexusBasicTable /></>}
        {widget === 'builds' && <><NexusBuildNote /><NexusTBCBuild /></>}
      </div>
    </div>
  )

}

const NexusWidgetsNote = () => (
  <p>Select a widget above to view some basic code examples. These are
    demo "widgets" I had created for a feature that developers could use
    to create their own interactive widgets.
  <br /><br />
  These widgets would then be
  available for authors to use to show more complex types of content.
  <br /><br />
  That feature was a challenging technical issue because running
  user-defined code has major security implications.
  <br /><br />
  I ended up using a solution similar to Twitch Extensions,
  utilizing seperate domains, multiple iframes, the postMessageAPI,
  a custom NPM package etc.
</p>
)

const NexusTableNote = () => (
  <p>This is a widget for creating a table of dynamic rows/cols.
  It's very simple and can be stored/repopulated using JSON.</p>
)

const NexusBuildNote = () => {

  const baseUrl = (
    `${GITHUB_REPO}/blob/main/code-examples/nexus-tbc-builds/app/hooks`
  )

  return (
    <p>This is a widget for a game, the main challenge was{' '}
      <a
        href={`${baseUrl}/useTalentBuildEngine.tsx#L170`}
        target="_blank">
        replicating all the rules</a> on what can and cannot be selected,
        and drawing/defining the{' '}<a
          href={`${baseUrl}/useTreePaths.tsx`}
          target="_blank">"linked" talents</a>.
    </p>
  )
}

export default Widgets
