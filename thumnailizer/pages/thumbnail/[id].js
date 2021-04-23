import Container from '@/components/Layout/Container'
import Layout from '@/components/Layout/Layout'
import { db } from '@/firebase';
import { useRouter } from 'next/router'
import { useDocument } from 'react-firebase-hooks/firestore';
import { DownloadIcon } from '@heroicons/react/outline'
import Button from '@/components/Inputs/Button';

const onDownload = (url) => {
  console.log({url})
  fetch(url)
  .then(response => {
    console.log({response})
    return response.blob()
  })
  .then(blob => {
    blob = blob.slice(0, blob.size, "image/jpg")
    downloadBlob(blob, `test`)
  });
}

function downloadBlob(blob, filename) {
  // Create an object URL for the blob object
  const url = URL.createObjectURL(blob);
  
  // Create a new anchor element
  const a = document.createElement('a');
  
  // Set the href and download attributes for the anchor element
  // You can optionally set other attributes like `title`, etc
  // Especially, if the anchor element will be attached to the DOM
  a.href = url;
  a.download = filename || 'download';
  
  // Click handler that releases the object URL after the element has been clicked
  // This is required for one-off downloads of the blob content
  const clickHandler = () => {
    setTimeout(() => {
      URL.revokeObjectURL(url);
      this.removeEventListener('click', clickHandler);
    }, 150);
  };
  
  // Add the click event listener on the anchor element
  // Comment out this line if you don't want a one-off download of the blob content
  // a.addEventListener('click', clickHandler, false);
  
  // Programmatically trigger a click on the anchor element
  // Useful if you want the download to happen automatically
  // Without attaching the anchor element to the DOM
  // Comment out this line if you don't want an automatic download of the blob content
  a.click();
  
  // Return the anchor element
  // Useful if you want a reference to the element
  // in order to attach it to the DOM or use it in some other way
  return a;
}


const Thumbnails = () => {
  const router = useRouter();
  const { id } = router.query;
  const [value, loading, error] = useDocument(db.doc(`thumbnails/${id}`));
  if (value) console.log({value: value.data()})

  // Check lodash pick
  let thumbnails = (value && value.data() && Object.entries(value.data()).filter(([k, v]) => k !== 'binaryData')) || []

  return (
    <Layout>
      <Container className="flex flex-col items-center justify-center py-16 md:mt-16">
        {loading
          ? <div>Loading</div>
          : (
            <>
              <div className="flex flex-col items-end space-y-16 md:flex-row">
                {thumbnails.sort().map(([resolution, url]) => (
                  <div
                    className="w-64 cursor-pointer group"
                    onClick={() => onDownload(url)}
                  >
                    <div className="grid h-114 place-items-end">
                      {!url && <div className="w-full text-center text-white">Loading...</div>}
                      {url && <img src={url} alt={resolution} className="mx-auto transition transform group-hover:scale-105 " />}
                    </div>
                    <span className="block mt-8 text-center text-white">
                      {resolution}
                      {url && <DownloadIcon className="inline-block w-4 h-4 ml-2 -mt-1 text-black transition-colors group-hover:text-yellow-400" />}
                    </span>
                  </div>
                ))}
              </div>
              {thumbnails.every(([_, url]) => url) && <Button className="mt-16 text-yellow-400" onClick={() => router.push('/')}>RESIZE ANOTHER IMAGE</Button>}
            </>
          )
        } 
      </Container>
    </Layout>
  )
}

export default Thumbnails
