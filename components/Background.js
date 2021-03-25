const Background = ({ src }) => {
  return (
    <>
      {
        src ?
          <img
            className="w-screen h-screen absolute left-0 z-0"
            src={src}
            alt="background"
          /> :
          <div
            className="bg-gray-200 dark:bg-gray-800 w-screen h-screen absolute"
          />
      }
    </>
  )
}

export default Background