import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { applyToJob, fetchMyApplications } from '../../features/applications/applicationsSlice'
import Spinner from '../../components/Spinner'
import { FiMapPin, FiClock, FiBriefcase, FiArrowLeft, FiCheck } from 'react-icons/fi'
import { formatDate } from '../../utils/formatDate'

const Page = styled.div`
  max-width: 800px;
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

const Card = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.xl};
  padding: 2rem;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1.5rem;
`

const CompanyInitial = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.4rem;
  margin-bottom: 1rem;
`

const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  margin-bottom: 0.25rem;
`

const CompanyName = styled.p`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  margin-bottom: 1rem;
`

const Tags = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
`

const Tag = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: ${({ theme }) => theme.colors.bgLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  padding: 0.35rem 0.8rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const Section = styled.div`
  margin-bottom: 1.5rem;
  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: ${({ theme }) => theme.colors.text};
  }
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    line-height: 1.8;
    font-size: 0.95rem;
    white-space: pre-wrap;
  }
`

const Salary = styled.div`
  background: ${({ theme }) => theme.colors.primary}11;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
  border-radius: ${({ theme }) => theme.radius.md};
  padding: 1rem 1.5rem;
  margin-bottom: 1.5rem;
  p { font-size: 0.8rem; color: ${({ theme }) => theme.colors.textMuted}; }
  strong { font-size: 1.2rem; color: ${({ theme }) => theme.colors.primary}; }
`

const ApplyBtn = styled.button`
  width: 100%;
  background: ${({ theme, $applied }) => $applied ? theme.colors.success : theme.colors.primary};
  color: #fff;
  padding: 1rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 700;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s;
  cursor: pointer;
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`

const JobDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { myApplications, loading: appLoading } = useSelector((s) => s.applications)
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  const alreadyApplied = myApplications.some(a => a.jobId === id)

  useEffect(() => {
    const fetchJob = async () => {
      const snap = await getDoc(doc(db, 'jobs', id))
      if (snap.exists()) setJob({ id: snap.id, ...snap.data() })
      setLoading(false)
    }
    fetchJob()
    if (user) dispatch(fetchMyApplications(user.uid))
  }, [id, user, dispatch])

  const handleApply = async () => {
    if (!user) return navigate('/login')
    await dispatch(applyToJob({
      jobId: id,
      jobTitle: job.title,
      company: job.company,
      candidateUid: user.uid,
      candidateName: user.displayName,
      candidateEmail: user.email,
    }))
  }

  if (loading) return <Spinner />
  if (!job) return <Page><p>Job not found.</p></Page>

  return (
    <Page>
      <BackBtn onClick={() => navigate(-1)}><FiArrowLeft /> Back to listings</BackBtn>
      <Card>
        <CompanyInitial>{job.company?.[0]?.toUpperCase()}</CompanyInitial>
        <Header>
          <div>
            <Title>{job.title}</Title>
            <CompanyName>{job.company}</CompanyName>
          </div>
          <span style={{ fontSize: '0.8rem', color: '#888' }}>Posted {formatDate(job.createdAt)}</span>
        </Header>
        <Tags>
          <Tag><FiMapPin size={12} />{job.location}</Tag>
          <Tag><FiBriefcase size={12} />{job.type}</Tag>
          <Tag><FiBriefcase size={12} />{job.role}</Tag>
          <Tag><FiClock size={12} />{job.experience}</Tag>
        </Tags>
        {job.salary && (
          <Salary>
            <p>Salary Range</p>
            <strong>{job.salary}</strong>
          </Salary>
        )}
        <Section>
          <h3>About the Role</h3>
          <p>{job.description}</p>
        </Section>
        {job.requirements && (
          <Section>
            <h3>Requirements</h3>
            <p>{job.requirements}</p>
          </Section>
        )}
        {user?.role === 'candidate' && (
          <ApplyBtn onClick={handleApply} disabled={alreadyApplied || appLoading} $applied={alreadyApplied}>
            {alreadyApplied ? <><FiCheck /> Applied!</> : appLoading ? 'Applying...' : 'Apply Now'}
          </ApplyBtn>
        )}
        {!user && (
          <ApplyBtn onClick={() => navigate('/login')}>Login to Apply</ApplyBtn>
        )}
      </Card>
    </Page>
  )
}

export default JobDetail
