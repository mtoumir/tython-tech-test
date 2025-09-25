import { Link } from "react-router-dom"
import { useState } from "react"
import { UserAuth } from "../context/AuthContext"

const Signup = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const {session} = UserAuth()
  console.log(session)

  return (
    <div>
      <form className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Sign up</h2>
        <p>
          sign in <Link to="/signin" className="text-blue-500">here</Link> if you have an account already
        </p>
        <div className="flex flex-col py-4">
          <input placeholder="Email" className="p-3 mt-6" type="email" />
          <input placeholder="Password" className="p-3 mt-6" type="password" />
          <button type="submit" disabled={loading} className="mt-6 w-full">Sign up</button>
        </div>
      </form>
    </div>
  )
}

export default Signup
