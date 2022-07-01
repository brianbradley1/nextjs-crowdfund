import { ConnectButton } from "web3uikit"
import { AppBar, Toolbar } from "@mui/material"
import Link from "next/link"

export default function Header() {
    return (
        <AppBar color="primary">
            <Toolbar sx={{ justifyContent: "space-between" }}>
                <Link href="/"><a style={{ color: "white", textDecoration: "none"}}>Crowdfund</a></Link>
                <ConnectButton moralisAuth={false} />
            </Toolbar>
        </AppBar>
    )
}
