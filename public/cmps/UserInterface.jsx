export function UserInterface({ onAddBug, filter, setFilter, filterByTxt }) {
  function onSetFilter({ target }) {
    console.log(target.value)
    setFilter(() => {
      return { txt: target.value }
    })
  }

  return (
    <div className='user-interface-container'>
      <input type='text' placeholder='Search' onChange={onSetFilter} />
      <button className='add-btn' onClick={onAddBug}>
        Add Bug
      </button>
    </div>
  )
}
