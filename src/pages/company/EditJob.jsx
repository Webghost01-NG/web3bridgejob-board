import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { updateJob } from '../../features/jobs/jobsSlice'
import { FiArrowLeft } from 'react-icons/fi'

const Page = styled.div`
  max-width: 700px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const BackBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`

const Field = styled.div`
  margin-bottom: 1.2rem;
  &.full { grid-column: 1 / -1; }
`

const Label = styled.label`
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 0.4rem;
  color: ${({ theme }) => theme.colors.textMuted};
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

const Select = styled.select`
  width: 100%;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 0.75rem 0.9rem;
  color: ${({ theme }) => theme.colors.text};
  font-size: 0.95rem;
  cursor: pointer;
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
  min-height: 120px;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.primary}; }
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
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const EditJob = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { loading } = useSelector((s) => s.jobs)
  const [form, setForm] = useState(null)

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDoc(doc(db, 'jobs', id))
      if (snap.exists()) setForm(snap.data())
    }
    fetch()
  }, [id])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await dispatch(updateJob({ id, data: form }))
    if (!res.error) navigate('/company/dashboard')
  }

  if (!form) return <Page><p style={{ color: '#888' }}>Loading...</p></Page>

  return (
    <Page>
      <BackBtn onClick={() => navigate('/company/dashboard')}><FiArrowLeft /> Back to Dashboard</BackBtn>
      <Title>Edit Job</Title>
      <Sub>Update your listing details below</Sub>
      <Card>
        <form onSubmit={handleSubmit}>
          <Grid>
            <Field>
              <Label>Job Title *</Label>
              <Input name="title" value={form.title || ''} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Location *</Label>
              <Input name="location" value={form.location || ''} onChange={handleChange} required />
            </Field>
            <Field>
              <Label>Job Type</Label>
              <Select name="type" value={form.type || 'Full-time'} onChange={handleChange}>
                {['Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'].map(t => <option key={t}>{t}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Role Category</Label>
              <Select name="role" value={form.role || 'Frontend'} onChange={handleChange}>
                {['Frontend', 'Backend', 'Fullstack', 'DevOps', 'Mobile', 'Design', 'Data'].map(r => <option key={r}>{r}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Experience Level</Label>
              <Select name="experience" value={form.experience || 'Entry Level'} onChange={handleChange}>
                {['Entry Level', 'Mid Level', 'Senior', 'Lead'].map(e => <option key={e}>{e}</option>)}
              </Select>
            </Field>
            <Field>
              <Label>Salary Range</Label>
              <Input name="salary" value={form.salary || ''} onChange={handleChange} placeholder="e.g. ₦300k – ₦500k/month" />
            </Field>
            <Field className="full">
              <Label>Job Description *</Label>
              <Textarea name="description" value={form.description || ''} onChange={handleChange} required />
            </Field>
            <Field className="full">
              <Label>Requirements</Label>
              <Textarea name="requirements" value={form.requirements || ''} onChange={handleChange} />
            </Field>
          </Grid>
          <Btn type="submit" disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Btn>
        </form>
      </Card>
    </Page>
  )
}

export default EditJob
