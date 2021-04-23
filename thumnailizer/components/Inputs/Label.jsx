const Label = props => {
  const { className, text, htmlFor, children } = props;
  return (
    <label htmlFor={htmlFor} className={`${className} text-xs md:text-sm mt-8 block mb-1 tracking-widest text-white`}>
      {text}
      {children}
    </label>
  )
}

export default Label
