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
  <p>Select a widget above to view some basic code examples. They are
    react components I had created for a feature of a different project. The
    feature being a way where anyone with react experience could create
    their own interactive react components to run on the site.
  <br /><br />
  These "widgets" (react components) would be available for authors to use to
  for showing more complex types of content.
  <br /><br />
  This was a challenging feature, because running user-defined code and sharing
  data with such has major security implications.
  <br /><br />
  I ended up with a solution that involved seperate domains,
  multiple iframes, the postMessage API, a custom NPM package etc.
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
