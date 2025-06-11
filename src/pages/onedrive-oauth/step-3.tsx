import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import siteConfig from '../../../config/site.config'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

import { getAuthPersonInfo, requestTokenWithAuthCode, sendTokenToServer } from '../../utils/oAuthHandler'
import { LoadingIcon } from '../../components/Loading'

export const runtime = 'edge'

export default function OAuthStep3({ accessToken, expiryTime, refreshToken, error, description, errorUri }) {
  const router = useRouter()
  const [expiryTimeLeft, setExpiryTimeLeft] = useState(expiryTime || 0)
  const [buttonContent, setButtonContent] = useState(<span>Store tokens <FontAwesomeIcon icon="key" /></span>)
  const [buttonError, setButtonError] = useState(false)

  useEffect(() => {
    if (!expiryTimeLeft) return
    const interval = setInterval(() => {
      setExpiryTimeLeft(prev => prev - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [expiryTimeLeft])

  const handleStoreToken = async () => {
    setButtonError(false)
    setButtonContent(<span>Storing... <LoadingIcon className="ml-1 inline h-4 w-4 animate-spin" /></span>)
    try {
      await sendTokenToServer(accessToken, refreshToken, expiryTime)
      setButtonContent(<span>Stored! Redirecting... <FontAwesomeIcon icon="check" /></span>)
      setTimeout(() => router.push('/'), 2000)
    } catch {
      setButtonError(true)
      setButtonContent(<span>Error storing token <FontAwesomeIcon icon="exclamation-circle" /></span>)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-white dark:bg-gray-900">
      <Head>
        <title>OAuth Step 3 - {siteConfig.title}</title>
      </Head>
      <Navbar />
      <main className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 p-6 rounded shadow">
          <div className="w-40 mx-auto mb-4">
            <Image src="/images/fabulous-celebration.png" width={160} height={160} alt="celebration" priority />
          </div>
          <h2 className="text-xl font-semibold text-center mb-4">Step 3/3: Finalize authentication</h2>
          {error ? (
            <div className="text-red-500">
              <p><FontAwesomeIcon icon="exclamation-circle" /> Error: {error}</p>
              <pre className="bg-gray-100 dark:bg-gray-700 p-2 mt-2 text-sm whitespace-pre-wrap">{description}</pre>
              {errorUri && <a className="text-blue-500 underline" href={errorUri} target="_blank">Learn more</a>}
              <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded" onClick={() => router.push('/onedrive-oauth/step-1')}>
                <FontAwesomeIcon icon="arrow-left" /> Restart
              </button>
            </div>
          ) : (
            <div>
              <p className="mb-2">✅ Authentication successful!</p>
              <ul className="text-sm">
                <li><strong>Access token:</strong> <code>{accessToken?.substring(0, 60)}...</code></li>
                <li><strong>Refresh token:</strong> <code>{refreshToken?.substring(0, 60)}...</code></li>
              </ul>
              <p className="mt-4 text-teal-500">Tokens will expire in: {Math.floor(expiryTimeLeft / 60)}m {expiryTimeLeft % 60}s</p>
              <button className={`mt-4 px-4 py-2 rounded text-white ${buttonError ? 'bg-red-500' : 'bg-green-500'}`} onClick={handleStoreToken}>
                {buttonContent}
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  )
}

export async function getServerSideProps({ query }) {
  const { authCode } = query
  if (!authCode) {
    return { props: { error: 'Missing authCode', description: 'You must complete step 2 before this step.' } }
  }

  const tokenResponse = await requestTokenWithAuthCode(authCode)
  if ('error' in tokenResponse) {
    return {
      props: {
        error: tokenResponse.error,
        description: tokenResponse.errorDescription,
        errorUri: tokenResponse.errorUri,
      },
    }
  }

  const { expiryTime, accessToken, refreshToken } = tokenResponse
  const { data, status } = await getAuthPersonInfo(accessToken)

  if (status !== 200) {
    return { props: { error: 'Graph API error', description: JSON.stringify(data) } }
  }

  if (data.userPrincipalName !== siteConfig.userPrincipalName) {
    return { props: { error: 'Invalid user', description: `Expected ${siteConfig.userPrincipalName}, got ${data.userPrincipalName}` } }
  }

  return {
    props: { error: null, expiryTime, accessToken, refreshToken },
  }
}
