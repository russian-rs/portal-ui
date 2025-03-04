import React, { useContext } from "react"
import { useNavigate } from "react-router"
import { UserContext } from "src/app/providers/UserContext"
import { hasPermission } from "src/shared/user/roles"
import MapComponent from "./components/MapComponent"
import { allowedRoles } from "./lib/roles"

export const Maps = () => {
    const { user } = useContext(UserContext)
    const navigate = useNavigate()

    if (!hasPermission(user, allowedRoles)) {
        navigate("/unauthorized")
    }

    return <MapComponent />
}

export default Maps
