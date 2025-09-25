import { Link } from "react-router-dom"
import { useState } from "react"
import { UserAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom"

const Signin = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const {session, signInUser} = UserAuth()
  const navigate = useNavigate()
  console.log(session)

  const handleSignIn = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signInUser(email, password)
      if (result.success) {
        navigate('/dashboard')
      } 
    } catch (error) {
      setError("an error occured")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleSignIn} className="max-w-md m-auto pt-24">
        <h2 className="font-bold pb-2">Sign In</h2>
        <p>
          sign up <Link to="/signin" className="text-blue-500">here</Link>
        </p>
        <div className="flex flex-col py-4">
          <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-3 mt-6" type="email" />
          <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="p-3 mt-6" type="password" />
          <button type="submit" disabled={loading} className="mt-6 w-full">Sign In</button>
          {error ? <p className="text-red-500">{error}</p> : null}
        </div>
      </form>
    </div>
  )
}

export default Signin
