import React from 'react'
import { ForgotPassword as ForgotPasswordComponent, Seo } from "../../components"

const ForgotPassword = (props) => {
    return (
        <>
      <Seo title="Forgot Password" />
            <ForgotPasswordComponent {...props} />
        </>
    )
}

export default ForgotPassword