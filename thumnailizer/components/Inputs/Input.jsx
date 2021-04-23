const Input = (props) => {
  const { id, className, type, value, onChange } = props;
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      className={`${className} text-sm h-10 px-2 py-2 w-full text-gray-300 border border-white bg-black focus:outline-none focus:ring focus:ring-yellow-500 focus:border-transparent `}
    />
  )
}

export default Input
