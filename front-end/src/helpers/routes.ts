interface Route {
    name: string,
    path: string,
    icon: string,
    navbar: boolean,
}

export const routes: Array<Route> = [
    { name: 'Home', path: '/', icon: '/placeholder-icon.svg', navbar: true },
    { name: 'Account', path: '/account', icon: '/placeholder-icon.svg', navbar: false },
    { name: 'Pets', path: '/pets/manage/', icon: '/placeholder-icon.svg', navbar: true },
    { name: 'Search', path: '/search', icon: '/placeholder-icon.svg', navbar: true },
]