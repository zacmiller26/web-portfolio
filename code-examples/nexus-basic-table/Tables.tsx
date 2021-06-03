import React, {
  createRef, useCallback, useEffect, useMemo, useState
} from 'react'
import autosize from 'autosize'
import { ComponentProps } from '../nexus-emulator'
import styles from './Tables.module.sass'


/*TODO->
  [X] Dont allow table_content to go below 1 row or 1 column
  [X] Make buttons less ugly
  [X] Max width/ellipsis long strings
  [X] Enforce Max Cols
  [X] Enforce Max Rows
*/

const MAX_COLS = 5
const MAX_ROWS = 40

type TableType = string[][]

const Tables = (props: ComponentProps) => {

  const { nexusData } = props

  //const [rows, setRows] = useState(['default'])
  const [table, setTable] = useState<TableType>(
    nexusData.table_content ? JSON.parse(nexusData.table_content) : [['', ''], ['', '']]
  )

  const tableRowCount = useMemo(() => {
    return table.length
  }, [table])

  const tableColCount = useMemo(() : number => {
    return table.length > 0 ? table[0].length : 0
  }, [table])

  const addTableRow = useCallback(() => {
    if(tableRowCount < MAX_ROWS) {
      const newRow: string[] = []
      for(var i = 0; i < tableColCount; ++i){
        newRow.push('')
      }
      setTable((p: TableType) => {
        let np = p
        np.push(newRow)
        return [...np]
      })
    }
  }, [tableRowCount, tableColCount])

  const addTableCol = useCallback(() => {
    if(tableColCount < MAX_COLS) {
      setTable((p: TableType) => {
        p.map((_row, x) => {
          p[x].push('')
        })
        return [...p]
      })
    }
  }, [tableColCount])

  const removeTableCol = useCallback((y: number) => {
    if(tableColCount > 1) {
      setTable((p: TableType) => {
        p.map((_row, x) => {
          p[x].splice(y, 1)
        })
        return [...p]
      })
    }
  }, [tableColCount])

  const removeTableRow = useCallback((x: number) => {
    if(tableRowCount > 1) {
      setTable((p: TableType) => {
        p.splice(x, 1)
        return [...p]
      })
    }
  }, [tableRowCount])

  // update table if nexusData changes
  useEffect(() => {
    if(nexusData.table_content) {
      setTable(JSON.parse(nexusData.table_content))
    }
  }, [nexusData.table_content])

  // keep nexusData is sync with table changes
  useEffect(() => {
    props.setNexusData((p: any) => ({
      ...p,
      table_content: JSON.stringify(table)
    }))
  }, [table])

  return (
    <div>
      <RenderTable
        table={table}
        setTable={setTable}
        edit={props.isEditor}
        addTableCol={addTableCol}
        addTableRow={addTableRow}
        tableColCount={tableColCount}
        tableRowCount={tableRowCount}
        removeTableCol={removeTableCol}
        removeTableRow={removeTableRow}
      />
      {props.isEditor && <ListErrors errors={props.nexusDataErrors} />}
    </div>
  )

}


interface TableProps {
  table: TableType
  setTable: Function
  edit: boolean
  addTableCol: Function
  tableRowCount: number
  tableColCount: number
  addTableRow: Function
  removeTableCol: Function
  removeTableRow: Function
}

const RenderTable = ({ table, setTable, edit, ...props }: TableProps) => {

  const [itemRefs, setItemRefs] = useState<{[key: string]: React.RefObject<any>}>({})

  useEffect(() => {
    let refs: {[key: string]: any} = {}
    table.map((row, x) => row.map((_item, y) => {
      refs[`${x}-${y}`] = createRef()
    }))
    setItemRefs(refs)
  }, [table])

  const handleInputChange = useCallback((e, x, y) => {
    setTable((p: TableType) => {
      p[x][y] = e.target.value
      return [...p]
    })
    const ref = itemRefs[`${x}-${y}`]
    if(ref && ref.current) {
      autosize(ref.current)
    }
  }, [setTable, itemRefs])

  const focusTextareaRef = useCallback((x: number, y: number) => {
    const ref = itemRefs[`${x}-${y}`]
    if(ref && ref.current) {
      ref.current.focus()
    }
  }, [itemRefs])

  // apply autosize to refs
  useEffect(() => {
    if(edit) {
      Object.entries(itemRefs).map(([_key, ref]) => {
        if(ref && ref.current) autosize(ref.current)
      })
    }
  }, [itemRefs, edit])

  return (
    <div className={styles.nexusTableRoot}>
      <div className={styles.nexusTable}>
        {edit &&
          <div className={styles.nexusTableRow +' '+ styles.header}>
            {table.length > 0 && table[0].map((_text: string, y) => (
              <div
                className={styles.nexusTableItem +' ' +styles.header}
                key={`header-${y}`}
              >
                <button
                  disabled={props.tableColCount === 1}
                  type="button"
                  onClick={() => props.removeTableCol(y)}
                >
                  - col
                </button>
              </div>
            ))}
            <span>
              <button type="button" onClick={() => props.addTableCol()}>+</button>
            </span>
          </div>
        }
        {table.map((row: string[], x) => (
          <div className={styles.nexusTableRow} key={x}>
            {row.map((text: string, y) => (
              <div
                className={styles.nexusTableItem} key={x + '-' + y}
                onClick={() => focusTextareaRef(x, y)}>
                {edit ?
                  <textarea
                    id={'ta_' + x + '-' + y}
                    name={'ta_' + x + '-' + y}
                    rows={1}
                    value={text}
                    onChange={e => handleInputChange(e, x, y)}
                    ref={itemRefs[`${x}-${y}`]}
                    placeholder="(empty)"
                  />
                  : text
                  }
              </div>
            ))}
            {edit &&
              <span>
                <button
                  disabled={props.tableRowCount === 1}
                  type="button"
                  onClick={() => props.removeTableRow(x)}
                >
                  -
                </button>
              </span>
            }
          </div>
          ))
        }
      </div>
      {edit &&
        <>
          <br />
          <button type="button" onClick={() => props.addTableRow()}>
            + row
          </button>
        </>
      }
    </div>
  )
}

const ListErrors = (props: { errors: any}) => {
  return !props.errors ? <React.Fragment /> : (
    <div>
      {Object.entries(props.errors).map((obj: any) => {
        return (
          <div key={obj[0]}>
            <h1>{obj[0]}</h1>
            <ul>
              {obj[1].map((error: string) => <li>{error}</li>)}
            </ul>
          </div>
        )
      })}
    </div>
  )
}

export default Tables
