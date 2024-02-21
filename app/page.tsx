import { authOptions } from "@/lib/auth"
import { getServerSession } from "next-auth"

const Home = async () => {
  const session = await getServerSession(authOptions)
  console.log(session)
  if (!session) return (
    <div>Not logged in</div>
  )

  return (
    <div>Hello {session?.user.name}</div>
  )
}
export default Home;