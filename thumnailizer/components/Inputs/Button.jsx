const Button = ({ className, onClick, children, type="button" }) => {
  return (
    <button type={type} className={`text-xl tracking-widest ${className}`} onClick={onClick}>{children}</button>
  )
}

export default Button
