import React from 'react'
import { Seo, SignUp as SignUpComponent } from "../../components"

const SignUp = (props) => {
    return (
        <>
            <Seo title="Sign Up" />
            <SignUpComponent {...props} />
        </>
    )
}

export default SignUp