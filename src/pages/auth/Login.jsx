import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { loginUser, clearError } from '../../features/auth/authSlice'
import { FiBriefcase, FiMail, FiLock } from 'react-icons/fi'

const Page = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at top, #1a0f3c 0%, ${({ theme }) => theme.colors.bg} 60%);
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`

const Title = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.25rem;
`

const Sub = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 2rem;
`

const Field = styled.div`
  margin-bottom: 1.2rem;
`

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const InputWrap = styled.div`
  position: relative;
  svg {
    position: absolute;
    left: 0.9rem;
    top: 50%;
    transform: translateY(-50%);
    color: ${({ theme }) => theme.colors.textMuted};
  }
`

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem 0.75rem 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  transition: border-color 0.2s;
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`

const Btn = styled.button`
  width: 100%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 0.85rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 1rem;
  margin-top: 0.5rem;
  transition: background 0.2s, transform 0.1s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:active { transform: scale(0.98); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const ErrorMsg = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: 0.85rem;
  margin-bottom: 1rem;
  text-align: center;
  background: ${({ theme }) => theme.colors.danger}11;
  padding: 0.6rem;
  border-radius: ${({ theme }) => theme.radius.sm};
`

const Footer = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  font-size: 0.88rem;
  color: ${({ theme }) => theme.colors.textMuted};
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading, error } = useSelector((s) => s.auth)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    dispatch(clearError())
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(loginUser(form))
    if (!res.error) {
      const role = res.payload?.role
      navigate(role === 'company' ? '/company/dashboard' : '/candidate/dashboard')
    }
  }

  return (
    <Page>
      <Card>
        <Logo><FiBriefcase size={22} /> Web3Bridge Jobs</Logo>
        <Title>Welcome back 👋</Title>
        <Sub>Log in to your account to continue</Sub>
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <form onSubmit={handleSubmit}>
          <Field>
            <Label>Email</Label>
            <InputWrap>
              <FiMail size={15} />
              <Input name="email" type="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
            </InputWrap>
          </Field>
          <Field>
            <Label>Password</Label>
            <InputWrap>
              <FiLock size={15} />
              <Input name="password" type="password" placeholder="••••••••" value={form.password} onChange={handleChange} required />
            </InputWrap>
          </Field>
          <Btn type="submit" disabled={loading}>{loading ? 'Logging in...' : 'Log In'}</Btn>
        </form>
        <Footer>Don't have an account? <Link to="/register">Register</Link></Footer>
      </Card>
    </Page>
  )
}

export default Login
