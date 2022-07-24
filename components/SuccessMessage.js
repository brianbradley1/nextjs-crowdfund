import React, { useState, useEffect } from "react"
import { Snackbar, Alert } from "@mui/material"

export default function SuccessMessage(props) {
    const { isOpen, message } = props

    const [open, setOpen] = useState(false)
    const [openMessage, setOpenMessage] = useState("")
    const [vertical, setVertical] = useState("top")
    const [horizontal, setHorizontal] = useState("center")

    useEffect(() => {
        setOpen(isOpen)
        setOpenMessage(message)
    }, [isOpen, message])

    return (
        <div>
            {open ? (
                <Snackbar
                    anchorOrigin={{
                        vertical: vertical,
                        horizontal: horizontal,
                    }}
                    open={open}
                    autoHideDuration={3000}
                    key={vertical + horizontal + "1"}
                >
                    <Alert onClose={() => setOpen(false)} severity="success">
                        {openMessage}
                    </Alert>
                </Snackbar>
            ) : null}
        </div>
    )
}
