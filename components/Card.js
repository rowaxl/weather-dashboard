const Card = ({ className, children }) => {
  return (
    <div
      className={"bg-white shadow-lg sm:rounded-3xl px-6 py-4 sm:px-12 sm:py-8 bg-clip-padding bg-opacity-60 border border-gray-200 " + className}
      style={{ backdropFilter: 'blur(20px)' }}
    >
      {children}
    </div>
  )
}

export default Card