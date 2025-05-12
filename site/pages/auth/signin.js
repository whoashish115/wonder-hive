import React from 'react'
import { Seo, SignIn as SignInComponent } from "../../components"

const SignIn = (props) => {
    return (
        <>
            <Seo title="Sign In" />
            <SignInComponent {...props} />
        </>
    )
}

export default SignIn