import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import SUPER from '../../assets/SUPER.png'
import LOGO from '../../assets/img/logo/logo2.png'
import Auth from '../../service/Auth'
import { logout, setAuth } from '../../store/features/auth/authSlice'
import Storage from '../../service/Storage'
import { useSelector } from 'react-redux'
import UserService from '../../service/UserService'
import { baseURL } from '../../utils/axios-custum'
import { isContains, roleIs, user } from '../../utils/function'
import DropDownLink from '../DropDownLink'

const API_STORAGE_URL = `${baseURL}/storage`;

const HeaderDashboard = () => {

  const [showDrop,setShowDrop] = useState(false)
  const auth = useSelector((state:any) => state.auth)
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const companiesStore = useSelector((state: any) => state.companies);

  const logoutUser = () => {
    dispatch(logout())
    Auth.logout()
    navigate('/')
  }

  useEffect(() => {
    dispatch(setAuth(Storage.getStorage('auth')))    
  },[dispatch])

  return (
    <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link to='/' className="flex-shrink-0 block text-gray-200 opacity-95 font-bold uppercase text-xl">
                <img src={LOGO} alt="" width={65} />
              </Link>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  <NavLink to="/dashboard" className="nav-link" aria-current="page">Tableau de bord</NavLink>

                  {roleIs('super') && <NavLink to="/admins" className="nav-link">Administrateurs</NavLink>}
                  
                  {(roleIs('admin') || roleIs('gerant')) && <NavLink to="/users" className="nav-link">Utilisateurs</NavLink>}

                  {roleIs("admin") && <NavLink to="/companies" className={`nav-link ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Entreprises</NavLink>}
                  
                  {roleIs("gerant") && <NavLink to={`/companies/${user().company_id}/view`} className={`nav-link ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Entreprises</NavLink>}
                  
                  {((!roleIs('super') && !roleIs('admin') && !roleIs('caissier')) || (roleIs('admin') && companiesStore.currentCompany)) && 
                    <DropDownLink
                      label='Gestions produits'
                      className='nav-link'
                    >
                      <NavLink to="/products" className={` bg-gray-100 hover:bg-gray-200 transition mb-2 p-2 w-full inline-block ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Produits</NavLink>
                      <NavLink to="/settings" className={` bg-gray-100 hover:bg-gray-200 transition p-2 w-full inline-block ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Catégories & fournisseurs</NavLink>
                    </DropDownLink>
                  }
                  
                  {((!roleIs('super') && !roleIs('admin') && !roleIs('caissier')) || (roleIs('admin') && companiesStore.currentCompany)) && 
                    <DropDownLink
                    label='Clients'
                      className='nav-link'
                    >
                    <NavLink to="/customers" className={`bg-gray-100 hover:bg-gray-200 transition mb-2 p-2 w-full inline-block ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Clients</NavLink>
                    <NavLink to="/customers" className={`bg-gray-100 disabled hover:bg-gray-200 transition mb-2 p-2 w-full inline-block ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Message ciblés</NavLink>
                  </DropDownLink>
                    
                  }
                  
                  {((!roleIs('super') &&  !roleIs('admin') && !roleIs('caissier')) || (roleIs('admin') && companiesStore.currentCompany)) && <NavLink to="/orders" className={`nav-link ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Commandes</NavLink>}

                  {((!roleIs('super') &&  !roleIs('admin')) || (roleIs('admin') && companiesStore.currentCompany)) &&  <NavLink to="/invoices" className={`nav-link ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Factures</NavLink>}
                  
                  {((!roleIs('super') &&  !roleIs('admin')) || (roleIs('admin') && companiesStore.currentCompany)) && !roleIs('user') &&  <NavLink to="/cashiers" className={`nav-link ${UserService.getUser().role === 'SUPER' && 'disabled'}`}>Caisse</NavLink>}

                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                <button type="button" className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">View notifications</span>
                  {/* <!-- Heroicon name: outline/bell --> */}
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </button>

                {/* <!-- Profile dropdown --> */}
                <div className="relative ml-3">
                  <div>
                    <button onClick={_=>setShowDrop(!showDrop)} type="button" className="flex max-w-xs items-center rounded-full bg-gray-800 text-sm focus:outline-none ring-2 ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <img className="h-8 w-8 rounded-full" src={(auth.user ? (auth.user.photo ? `${API_STORAGE_URL}/`+auth.user.photo : SUPER) : SUPER)} alt="" />
                    </button>
                  </div>

                  {showDrop &&
                  <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button" tabIndex={-1}>
                    {/* <!-- Active: "bg-gray-100", Not Active: "" --> */}
                    <Link to="/profil" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1} id="user-menu-item-0">Votre profil</Link>
                    
                    {!roleIs('admin') && !roleIs('super') && <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1} id="user-menu-item-1">paramètre</Link>}

                    <button onClick={logoutUser} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" tabIndex={-1} id="user-menu-item-2">Se déconnecter</button>
                  </div>
                  }

                </div>
              </div>
            </div>
            <div className="-mr-2 flex md:hidden">
              {/* <!-- Mobile menu button --> */}
              <button type="button" className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" aria-controls="mobile-menu" aria-expanded="false">
                <span className="sr-only">Open main menu</span>
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <svg className="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* <!-- Mobile menu, show/hide based on menu state. --> */}
        <div className="md:hidden" id="mobile-menu">
            <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
              {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
              <Link to="/" className="bg-gray-900 text-white block px-3 py-2 rounded-md text-base font-medium" aria-current="page">Dashboard</Link>

              <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Team</Link>

              <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Projects</Link>

              <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Calendar</Link>

              <Link to="/" className="text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium">Reports</Link>
            </div>
            <div className="border-t border-gray-700 pt-4 pb-3">
              <div className="flex items-center px-5">
                <div className="flex-shrink-0">
                  <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium leading-none text-white">Tom Cook</div>
                  <div className="text-sm font-medium leading-none text-gray-400">tom@example.com</div>
                </div>
                <button type="button" className="ml-auto flex-shrink-0 rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                  <span className="sr-only">View notifications</span>
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                  </svg>
                </button>
              </div>
              <div className="mt-3 space-y-1 px-2">
                <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white ">Votre profil</Link>

                <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">paramètre</Link>

                <Link to="/" className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white">Se déconnecter</Link>
              </div>
            </div>
          </div>
        </nav>
  )
}

export default HeaderDashboard