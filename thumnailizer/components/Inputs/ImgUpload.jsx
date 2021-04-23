
import { useDropzone } from 'react-dropzone'

const ImageUpload = ({ onDrop }) => {
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  return (
    <div {...getRootProps({ className: "cursor-pointer p-8 flex flex-col items-center justify-center border-8 border-dashed border-white w-full h-full xl:w-200 xl:h-100" })}>
      <input {...getInputProps({ className: "" })} />
      <span className="text-yellow-400 text-8xl">+</span>
      {
        isDragActive
          ? <p className="text-center text-gray-400">Drop the files here ...</p>
          : <p className="text-center text-gray-400">Drag 'n' drop some files here, or click to select files</p>
      }
    </div>
  )
}

export default ImageUpload;