const Container = ({ children, className }) => {
  return (
    <div className={`${className} sm:w-160 md:w-192 xl:w-256 mx-auto px-4 sm:px-4 xl:p-0`}>
      {children}
    </div>
  )
}

export default Container
