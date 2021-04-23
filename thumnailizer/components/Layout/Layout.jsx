import Head from 'next/head'
import Container from '@/components/Layout/Container'
import Link from 'next/link'
import firebase, { auth } from '@/firebase'
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { useAppContext } from 'context/AppContext'
import Button from '../Inputs/Button'

const Layout = ({ children }) => {
  const { dispatch } = useAppContext();
  const router = useRouter();
  const [user, loading, error] = useAuthState(auth);

  const logout = () => {
    firebase.auth().signOut();
    dispatch({ type: "REMOVE_IMAGE"});
    router.push('/')
  };

  return (
    <>
      <Head>
        <title>I M G R S Z E R</title>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat&display=swap" rel="stylesheet" />
      </Head>
      <nav className="w-full h-16 text-white bg-black border-b-2 border-white">
        <Container className="flex items-center justify-between h-16 sm:p-8">
          <Link href="/">
            <div className="tracking-widest cursor-pointer">IMGRSZR</div>
          </Link>
          <div className="flex items-center space-x-1 md:space-x-2">
            {user && (
              <>
                <div className="ml-8 text-xs text-gray-200 truncate">{user.displayName || user.email}</div>
                <Button className="flex-shrink-0 text-yellow-400" onClick={logout}>LOG OUT</Button>
              </>
            )}
            {(!user || loading) && (
              <>
                <Link href="/sign_in">
                  <div className="mr-4 tracking-widest text-center text-yellow-300 cursor-pointer md:mr-8">SIGN IN</div>
                </Link>
                <Link href="/sign_up">
                  <div className="tracking-widest text-center cursor-pointer">SIGN UP</div>
                </Link>
              </>
            )}
          </div>
        </Container>
      </nav>
      {children}
    </>
  )
}

export default Layout
