import { lazy } from 'react'
import { RouteProps } from 'react-router-dom'

const Login = lazy(() => import('src/pages/login'))
const Logout = lazy(() => import('src/pages/logout'))
const Profile = lazy(() => import('src/pages/profile'))

export const routes: RouteProps[] = [
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/logout',
        exact: true,
        component: Logout,
    },
    {
        path: '/profile',
        exact: true,
        component: Profile,
    },
]
