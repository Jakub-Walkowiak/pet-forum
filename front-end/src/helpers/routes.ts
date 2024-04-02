interface Route {
    name: string,
    path: string,
    icon: string,
    navbar: boolean,
}

export const routes: Array<Route> = [
    { name: 'Home', path: '/', icon: '/placeholder-icon.svg', navbar: true },
    { name: 'Account', path: '/account', icon: '/placeholder-icon.svg', navbar: false },
    { name: 'Advice', path: '/advice', icon: '/placeholder-icon.svg', navbar: true },
]