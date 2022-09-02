import { useEffect } from "react"
import { useRouter } from "next/router"

const Custom404: React.FC = () => {
    const router = useRouter()

    useEffect(() => {
      router.replace("/test/jobs/")
    })
  
    return null
}

export default Custom404;