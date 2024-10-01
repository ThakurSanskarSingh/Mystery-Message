import { Session } from 'inspector/promises'
import { signIn, signOut, useSession } from 'next-auth/react'
import React from 'react'

export default function Component() {
    const {data : session} = useSession()
    if(session){
        return (
            <>
            Signed in AS {session.user.email} <br />
            <button onClick={()   => signOut()}> Sign Out</button>
            </>
            )
        
    }
   

return (
    <>
    Not SInged IN <br />
    <button onClick={() => signIn}>Sign in</button></>
)
}