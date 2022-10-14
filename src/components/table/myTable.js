import React, { useState, useEffect } from 'react'
import './myTable.scss'

function MyTable() {
  const headerCols = [
    'ID',
    'First Name',
    'Second Name',
    'Active',
    'Salary',
    'Delete',
    'Edit'
  ]

  // const mainData = []

  const siteCode = '713a6c1a-a5da-42d6-ae57-58f513ab838d'
  const myUrl = `https://run.mocky.io/v3/${siteCode}`

  const [mainData, setMainData] = useState([])

  useEffect(() => {
    console.log('I am using a effect hook')
    if (mainData.length === 0) {
      fetch(myUrl)
        .then((response) => response.json())
        .then((data) => {
          console.log('data received: ', data)
          setMainData(data)
        })
    }
  })

  const removeRow = ((rowData) => {
    console.log('remove row', rowData)
    console.log('filter', mainData.filter((row) => (row.id !== rowData.id)))
    setMainData(mainData.filter((row) => (row.id !== rowData.id)))
  })

  const [editingRow, setEditingRow] = useState()

  const updateRow = (value, rowData, field) => {
    const rowToUpdate = mainData.filter((row) => (row.id === rowData.id))
    console.log('rowToUpdate[0]: ', rowToUpdate[0])
    console.log('field: ', field)
    rowToUpdate[0][field] = value
  }

  // https://run.mocky.io/v3/713a6c1a-a5da-42d6-ae57-58f513ab838d

  return (
    <table>
      <thead>
        <tr>
          {headerCols.map((col) => (
            <td className="table-head">
              {col}
            </td>
          ))}
        </tr>
      </thead>
      <tbody>
        {mainData.map((data) => (
          <tr key={data.id}>
            {Object.entries(data).map(([prop, value]) => (
              <td
                className="table-body"
                name={prop}
                contentEditable={data.id === editingRow}
                field={prop}
                onBlur={(event) => {
                  updateRow(event.target.innerHTML, data, prop)
                }}
              >
                {value}
              </td>
            ))}
            <td className="table-body">
              <button type="button" onClick={() => { removeRow(data) }}>
                Delete Row
              </button>
            </td>
            <td className="table-body">
              <button type="button" onClick={() => { setEditingRow(data.id) }}>
                Edit Row
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MyTable
