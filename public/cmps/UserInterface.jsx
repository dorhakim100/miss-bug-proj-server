const { useRef } = React
const { Link } = ReactRouterDOM

export function UserInterface({ onAddBug, filter, setFilter, filterBy }) {
  const textFilter = useRef(filter.txt)
  const severityFilter = useRef(filter.minSeverity)

  function onSetFilter({ target }) {
    console.log(target.type)
    console.log(target.value)
    switch (target.type) {
      case 'text':
        textFilter.current = target.value

        break
      case 'range':
        severityFilter.current = +target.value

        break
    }
    setFilter(() => {
      return { txt: textFilter.current, minSeverity: severityFilter.current }
    })
  }

  function onDownloadPDF() {
    console.log('works')
  }

  return (
    <div className='user-interface-container'>
      <input
        type='range'
        min={0}
        max={10}
        onChange={onSetFilter}
        title={severityFilter.current}
      />
      <input type='text' placeholder='Search' onChange={onSetFilter} />
      <button className='add-btn' onClick={onAddBug}>
        Add Bug
      </button>
      <Link to={'download'}>
        <button onClick={onDownloadPDF}>Download PDF</button>
      </Link>
    </div>
  )
}
