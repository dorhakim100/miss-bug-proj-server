const { useRef } = React
const { Link } = ReactRouterDOM

export function UserInterface({
  onAddBug,
  filter,
  setFilter,
  filterBy,
  changePage,
}) {
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

  function onChangePage(diff) {
    if (filter.pageIdx === 0 && diff === -1) {
      return
    }
    changePage(diff)
  }

  return (
    <div className='user-interface-container'>
      <div className='page-buttons-container'>
        <i
          onClick={() => onChangePage(-1)}
          className='fa-solid fa-arrow-left'
        ></i>
        <span>{filter.pageIdx + 1}</span>
        <i
          onClick={() => onChangePage(1)}
          className='fa-solid fa-arrow-right'
        ></i>
      </div>
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
      <div className='label-sorting-container'>
        <div className='label-input-container'>
          <input type='checkbox' name='critical' id='critical' />
          <label htmlFor='critical'>critical</label>
        </div>
        <div className='label-input-container'>
          <input type='checkbox' name='needCR' id='needCR' />
          <label htmlFor='needCR'>needCR</label>
        </div>
        <div className='label-input-container'>
          <input type='checkbox' name='devBranch' id='devBranch' />
          <label htmlFor='devBranch'>devBranch</label>{' '}
        </div>
      </div>
    </div>
  )
}
