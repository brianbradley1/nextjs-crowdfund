import { MoralisProvider } from "react-moralis"
import { NotificationProvider } from "web3uikit"
import "../styles/globals.css"

//import PropTypes from "prop-types"
import Head from "next/head"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import { CacheProvider } from "@emotion/react"
import theme from "../theme"
import createEmotionCache from "../createEmotionCache"

const clientSideEmotionCache = createEmotionCache()

function MyApp({ Component, emotionCache = clientSideEmotionCache, pageProps }) {
    return (
        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant,
				consistent, and simple baseline to
				build upon. */}

                <CssBaseline />
                <MoralisProvider initializeOnMount={false}>
                    <NotificationProvider>
                        <Component {...pageProps} />
                    </NotificationProvider>
                </MoralisProvider>
            </ThemeProvider>
        </CacheProvider>
    )
}

export default MyApp

// MyApp.propTypes = {
//     Component: PropTypes.elementType.isRequired,
//     emotionCache: PropTypes.object,
//     pageProps: PropTypes.object.isRequired,
// }
