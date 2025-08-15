// "use client"

// import { useState } from "react"
// import { LoginForm } from "@/components/auth/login-form"
// import { RegisterForm } from "@/components/auth/register-form"

// export default function HomePage() {
//   const [isLogin, setIsLogin] = useState(true)

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
    
//       <div className="w-full max-w-md">
//         {isLogin ? (
//           <LoginForm onToggleMode={() => setIsLogin(false)} />
//         ) : (
//           <RegisterForm onToggleMode={() => setIsLogin(true)} />
//         )}
//       </div>
//     </div>
//   )
// }
"use client"

import { useState } from "react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function HomePage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen w-full bg-[#020617] relative flex items-center justify-center">
      
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_500px_at_50%_300px,rgba(16,185,129,0.35),transparent)]" />

    
      <div className="relative z-10 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  )
}


