import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { logoutUser } from '../features/auth/authSlice'
import { FiBriefcase, FiLogOut, FiUser, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'

const Nav = styled.nav`
  background: ${({ theme }) => theme.colors.bgCard};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0 2rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;
`

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary};
  span { color: ${({ theme }) => theme.colors.text}; }
`

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    display: ${({ $open }) => ($open ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 64px;
    left: 0; right: 0;
    background: ${({ theme }) => theme.colors.bgCard};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding: 1rem 2rem;
    gap: 1rem;
  }
`

const NavLink = styled(Link)`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  font-weight: 500;
  transition: color 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const Badge = styled.span`
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
`

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  padding: 0.4rem 0.8rem;
  border-radius: ${({ theme }) => theme.radius.sm};
  transition: all 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.bgLight}; color: ${({ theme }) => theme.colors.danger}; }
`

const MenuBtn = styled.button`
  display: none;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.4rem;
  @media (max-width: 768px) { display: flex; }
`

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector((state) => state.auth)
  const [open, setOpen] = useState(false)

  const handleLogout = async () => {
    await dispatch(logoutUser())
    navigate('/login')
  }

  return (
    <Nav>
      <Logo to="/"><FiBriefcase /> Web3Bridge <span>Jobs</span></Logo>
      <MenuBtn onClick={() => setOpen(o => !o)}>{open ? <FiX /> : <FiMenu />}</MenuBtn>
      <NavLinks $open={open}>
        <NavLink to="/jobs">Browse Jobs</NavLink>
        {user ? (
          <>
            <Badge>{user.role}</Badge>
            {user.role === 'candidate' && (
              <>
                <NavLink to="/candidate/dashboard"><FiUser size={14} /> Dashboard</NavLink>
                <NavLink to="/candidate/applications">My Applications</NavLink>
                <NavLink to="/candidate/profile">Profile</NavLink>
              </>
            )}
            {user.role === 'company' && (
              <>
                <NavLink to="/company/dashboard"><FiBriefcase size={14} /> Dashboard</NavLink>
                <NavLink to="/company/post-job">Post a Job</NavLink>
              </>
            )}
            <LogoutBtn onClick={handleLogout}><FiLogOut size={14} /> Logout</LogoutBtn>
          </>
        ) : (
          <>
            <NavLink to="/login">Login</NavLink>
            <NavLink to="/register" style={{ color: '#6C47FF', fontWeight: 600 }}>Register</NavLink>
          </>
        )}
      </NavLinks>
    </Nav>
  )
}

export default Navbar
