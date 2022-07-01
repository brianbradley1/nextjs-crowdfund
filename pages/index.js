// imports instead of require
// nodejs != emcascript / javascript
// backend js bit diff to front end js

import Head from "next/head"
import Header from "../components/Header"
import styles from "../styles/Home.module.css"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Crowdfund</title>
                <meta name="description" content="Crowdfund Dapp" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://nextjs.org">
                        Next.js!</a> integrated with{" "}
                    <a href="https://mui.com/">Material-UI!</a>
                </h1>
                <p className={styles.description}>
                    Get started by editing{" "}
                    <code className={styles.code}>
                        pages/index.js</code>
                </p>
  
            </main>
            <footer className={styles.footer}></footer>
            
        </div>
    )
}
