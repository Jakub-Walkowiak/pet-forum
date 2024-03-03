
interface Route {
    name: string,
    path: string,
    icon: string,
}

export const routes: Array<Route> = [
    { name: 'Home', path: '/', icon: 'placeholder-icon.svg' },
    { name: 'Test', path: '/test', icon: 'placeholder-icon.svg' },
]