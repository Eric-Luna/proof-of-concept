import Head from 'next/head'
import { useCallback, useState } from 'react'
import Layout from '@/components/Layout/Layout'
import Container from '@/components/Layout/Container'
import ImgUpload from '@/components/Inputs/ImgUpload'
import Button from '@/components/Inputs/Button'
import { auth, db, storage } from '@/firebase'
import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useAppContext } from 'context/AppContext'

export default function Home() {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);
  const [uploading, setUploading] = useState(false);
  const [binaryData, setBinaryData] = useState();
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader()

      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = () => {
        const binaryStr = reader.result
        setBinaryData(binaryStr);
      }
      reader.readAsDataURL(file);
    })
    
  }, [])

  const onContinue = async () => {
    setUploading(true);
    const thumbnailsRef = db.collection('thumbnails');
    let thumbnail = await thumbnailsRef.add({
      // binaryData,
      "400x300": "",
      "160x120": "",
      "120x120": "",
    })
    let storageRef = storage.ref();
    let originalRef = storageRef.child(`thumbnails/${thumbnail.id}/original.jpg`);
    
    if (user) {
      await originalRef.putString(binaryData, 'data_url');
      return router.push(`thumbnail/${thumbnail.id}`)
    };
    dispatch({ type: 'ADD_IMAGE', payload: binaryData })
    return router.push(`sign_in?thumbnail_id=${thumbnail.id}`);
  }

  return (
    <div className="h-screen text-white">
      <Head>
        <title>I M G R S Z E R</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main>
          <Container className="grid mt-16 h-100 place-items-center">
            {binaryData
              ?  !uploading 
                ? (
                    <div className="w-full">
                      <img src={binaryData} className="mx-auto" />
                      <div className="flex justify-around w-3/4 mx-auto mt-8">
                        <Button>CANCEL</Button>
                        <Button className="text-yellow-400" onClick={onContinue}>CONTINUE</Button>
                      </div>
                    </div>
                  )
                : <div>UPLOADING</div>
              : <ImgUpload onDrop={onDrop} />
            }
          </Container>
        </main>
      </Layout>
    </div>
  )
}
