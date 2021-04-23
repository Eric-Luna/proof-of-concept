import { useState } from 'react';
import firebase from '../firebase.config';
import Head from 'next/head'
import Layout from '@/components/Layout/Layout'
import Container from '@/components/Layout/Container'
import Label from '@/components/Inputs/Label'
import { useAppContext } from 'context/AppContext'
import Input from '@/components/Inputs/Input'
import { storage } from '@/firebase'
import { useRouter } from 'next/router'


export default function SignUp() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state: appState } = useAppContext();
  const { thumbnail_id } = router.query;

  const signUp = async (e) => {
    e.preventDefault();
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
    } catch (error) {
      return setError(error.message);
    }
    if (thumbnail_id) {
      if (appState.image) {
        let storageRef = storage.ref();
        let originalRef = storageRef.child(`thumbnails/${thumbnail_id}/original.jpg`);  
        await originalRef.putString(appState.image, 'data_url');
      }
      return router.push(`/thumbnail/${thumbnail_id}`);
    }
    return router.push('/');
  };

  return (
    <div className="h-screen text-white">
      <Head>
        <title>I M G R S Z R | Log In</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <main className="h-minus-nav">
          <Container className="flex items-center justify-center h-full">
            <div className="p-8 border border-white w-120">
              <h1 className="tracking-widest text-center text-gray-300">CREATE AN ACCOUNT</h1>
              <div className="flex w-full mt-8 space-x-4">
                <div className="grid w-1/3 h-10 border border-white cursor-pointer place-items-center">F</div>
                <div className="grid w-1/3 h-10 border border-white cursor-pointer place-items-center">G</div>
                <div className="grid w-1/3 h-10 border border-white cursor-pointer place-items-center">T</div>
              </div>
              <form onSubmit={signUp}>
                <Label text="EMAIL" htmlFor="email" className="focus-within:text-yellow-400">
                  <Input id="email" type="text" className="mt-2" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Label>

                <Label text="PASSWORD" htmlFor="password" className="focus-within:text-yellow-400">
                  <Input id="password" type="password" className="mt-2" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Label>

                <div className="flex justify-around mt-12">
                  <button onClick={() => router.back()} className="text-base tracking-widest md:text-xl">CANCEL</button>
                  <button type="submit" className="text-base tracking-widest text-yellow-400 md:text-xl">SIGN UP</button>
                </div>
              </form>
            </div>
          </Container>
        </main>
      </Layout>
    </div>
  )
}
