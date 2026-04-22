import { useState } from 'react'
import { useSelector } from 'react-redux'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import styled from 'styled-components'
import { FiUser, FiLink, FiCode, FiSave } from 'react-icons/fi'

const Page = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
`

const Sub = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 2rem;
`

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
`

const AvatarCircle = styled.div`
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: 1.5rem;
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
  display: flex;
  align-items: center;
  gap: 0.4rem;
`

const Input = styled.input`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const Textarea = styled.textarea`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  resize: vertical;
  min-height: 100px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
`

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 0.75rem 1.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 0.95rem;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`

const SuccessMsg = styled.p`
  color: ${({ theme }) => theme.colors.success};
  font-size: 0.85rem;
  margin-top: 1rem;
`

const CandidateProfile = () => {
  const { user } = useSelector((s) => s.auth)
  const [form, setForm] = useState({
    bio: user?.bio || '',
    skills: user?.skills || '',
    github: user?.github || '',
    linkedin: user?.linkedin || '',
    portfolio: user?.portfolio || '',
  })
  const [saved, setSaved] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSave = async () => {
    await updateDoc(doc(db, 'users', user.uid), form)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <Page>
      <Title>My Profile</Title>
      <Sub>Help companies know who you are</Sub>
      <Card>
        <AvatarCircle>{user?.displayName?.[0]?.toUpperCase()}</AvatarCircle>

        <Field>
          <Label><FiUser size={13} /> Full Name</Label>
          <Input value={user?.displayName} disabled style={{ opacity: 0.5 }} />
        </Field>
        <Field>
          <Label><FiUser size={13} /> Email</Label>
          <Input value={user?.email} disabled style={{ opacity: 0.5 }} />
        </Field>
        <Field>
          <Label>Bio</Label>
          <Textarea name="bio" placeholder="Tell companies a bit about yourself..." value={form.bio} onChange={handleChange} />
        </Field>
        <Field>
          <Label><FiCode size={13} /> Skills (comma separated)</Label>
          <Input name="skills" placeholder="React, Node.js, TypeScript, Firebase..." value={form.skills} onChange={handleChange} />
        </Field>
        <Field>
          <Label><FiLink size={13} /> GitHub URL</Label>
          <Input name="github" placeholder="https://github.com/username" value={form.github} onChange={handleChange} />
        </Field>
        <Field>
          <Label><FiLink size={13} /> LinkedIn URL</Label>
          <Input name="linkedin" placeholder="https://linkedin.com/in/username" value={form.linkedin} onChange={handleChange} />
        </Field>
        <Field>
          <Label><FiLink size={13} /> Portfolio URL</Label>
          <Input name="portfolio" placeholder="https://yourportfolio.dev" value={form.portfolio} onChange={handleChange} />
        </Field>

        <SaveBtn onClick={handleSave}><FiSave size={15} /> Save Profile</SaveBtn>
        {saved && <SuccessMsg>✅ Profile saved successfully!</SuccessMsg>}
      </Card>
    </Page>
  )
}

export default CandidateProfile
