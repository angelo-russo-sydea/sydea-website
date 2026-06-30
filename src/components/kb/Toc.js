import { TextSelection } from '@tiptap/pm/state'

export const ToCItem = ({ item, onItemClick }) => {
  return (
    <div
      className={`${item.isActive && !item.isScrolledOver ? 'is-active' : ''} ${item.isScrolledOver ? 'is-scrolled-over' : ''}`}
      style={{
        '--level': item.level,
      }}
    >
      <a href={`#${item.id}`} onClick={e => onItemClick(e, item.id)} data-item-index={item.displayIndex}>
        {item.textContent}
         {/* {item.displayIndex}. {item.textContent} */}
      </a>
    </div>
  )
}

export const ToCEmptyState = () => {
  return (
    <div className="empty-state">
      <p>Inizia a inserire i titoli del documento per visualizzare la struttura.</p>
    </div>
  )
}

export const ToC = ({ items = [], editor, scrollRef }) => {
  if (items.length === 0) {
    return <ToCEmptyState />
  }

  const onItemClick = (e, id) => {
    e.preventDefault();

    if (editor) {
      const element = editor.view.dom.querySelector(`[data-toc-id="${id}"`)
      const pos = editor.view.posAtDOM(element, 0)

      // set focus
      const tr = editor.view.state.tr

      tr.setSelection(new TextSelection(tr.doc.resolve(pos)))

      editor.view.dispatch(tr)

      editor.view.focus()

      // eslint-disable-next-line
      if (history.pushState) {
        // eslint-disable-next-line
        history.pushState(null, null, `#${id}`)
      }

      const container = scrollRef.current
        const containerRect = container.getBoundingClientRect()
        const elementRect = element.getBoundingClientRect()
        const offset = elementRect.top - containerRect.top

    //   window.scrollTo({
    //     top: element.getBoundingClientRect().top + window.scrollY,
    //     behavior: 'smooth',
    //   })
        container.scrollTo({
            top: container.scrollTop + offset - 120,
            behavior: "smooth",
        })
    }
  }

  return (
    <>
      {items.map((item, i) => (
        <ToCItem onItemClick={onItemClick} key={item.id} item={item} index={i + 1} />
      ))}
    </>
  )
}