import { useAuth } from "../context/AuthContext"

const GlobalLoader = () => {
    const { globalLoading } = useAuth()

    if (!globalLoading) return null;

    return (
        <div className="flex justify-center items-center h-screen">
            <p className="text-lg font-semibold text-gray-600 animate-pulse">
                Loading...
            </p>
        </div>
    )
}
export default GlobalLoader