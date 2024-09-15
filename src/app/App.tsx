import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { useContext } from 'react'
import { AuthContext } from './providers/AuthContext.tsx'
import '@mantine/core/styles.css'
import { Button } from '@mantine/core'
import { UserApiService } from '../shared/api/userApiService/UserApiService.ts'
import { history } from '../shared/constants/History.ts'
import { SimpleLocalStorageService } from '../shared/localStorage/SimpleLocalStorageService.tsx'
import { LocalStorageKeys } from '../shared/localStorage/constants.ts'

function App() {
    const user = useContext(AuthContext)

    const handleLogout = () => {
        UserApiService.logout(true).then(() => {
            SimpleLocalStorageService.removeItem(LocalStorageKeys.user)
            history.replace({
                pathname: '/',
            })
            location.reload()
        })
    }

    return (
        <>
            <div>
                <a href="https://vitejs.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
                <a href="https://react.dev" target="_blank">
                    <img
                        src={reactLogo}
                        className="logo react"
                        alt="React logo"
                    />
                </a>
            </div>
            <h1>Hello, {user?.fullName}</h1>
            <Button onClick={handleLogout}>Выйти</Button>
        </>
    )
}

export default App
