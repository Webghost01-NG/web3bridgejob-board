import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchCompanyJobs, deleteJob } from '../../features/jobs/jobsSlice'
import Spinner from '../../components/Spinner'
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiEye } from 'react-icons/fi'
import { timeAgo } from '../../utils/formatDate'

const Page = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`

const PageTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  span { color: ${({ theme }) => theme.colors.primary}; }
`

const PostBtn = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  padding: 0.7rem 1.2rem;
  border-radius: ${({ theme }) => theme.radius.md};
  font-weight: 600;
  font-size: 0.9rem;
  transition: background 0.2s;
  &:hover { background: ${({ theme }) => theme.colors.primaryDark}; }
`

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.8rem; margin-bottom: 0.3rem; }
  strong { font-size: 1.8rem; font-weight: 800; color: ${({ theme }) => theme.colors.primary}; }
`

const JobRow = styled.div`
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 0.75rem;
  transition: border-color 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
`

const JobInfo = styled.div`
  h3 { font-size: 1rem; font-weight: 700; margin-bottom: 0.2rem; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.82rem; }
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const Badge = styled.span`
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: ${({ theme }) => theme.colors.bgLight};
  padding: 0.3rem 0.7rem;
  border-radius: 20px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const IconBtn = styled.button`
  background: ${({ theme }) => theme.colors.bgLight};
  color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.6rem;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${({ $danger, theme }) => $danger ? theme.colors.danger + '22' : theme.colors.bgCard};
    color: ${({ $danger, theme }) => $danger ? theme.colors.danger : theme.colors.text};
  }
`

const IconLink = styled(Link)`
  background: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.6rem;
  display: flex;
  align-items: center;
  transition: all 0.2s;
  &:hover {
    background: ${({ theme }) => theme.colors.bgCard};
    color: ${({ theme }) => theme.colors.text};
  }
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  h3 { margin-bottom: 0.5rem; color: ${({ theme }) => theme.colors.text}; }
`

const CompanyDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { companyJobs, loading } = useSelector((s) => s.jobs)

  useEffect(() => {
    if (user) dispatch(fetchCompanyJobs(user.uid))
  }, [dispatch, user])

  const totalApplications = companyJobs.reduce((sum, j) => sum + (j.applicationsCount || 0), 0)

  const handleDelete = (id) => {
    if (window.confirm('Delete this job listing?')) dispatch(deleteJob(id))
  }

  return (
    <Page>
      <TopBar>
        <PageTitle>Welcome, <span>{user?.company || user?.displayName}</span> 👋</PageTitle>
        <PostBtn to="/company/post-job"><FiPlus /> Post a Job</PostBtn>
      </TopBar>

      <StatsRow>
        <StatCard><p>Active Listings</p><strong>{companyJobs.length}</strong></StatCard>
        <StatCard><p>Total Applications</p><strong>{totalApplications}</strong></StatCard>
      </StatsRow>

      <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem', fontWeight: 700 }}>Your Job Listings</h2>

      {loading ? <Spinner /> : companyJobs.length === 0 ? (
        <Empty>
          <h3>No listings yet</h3>
          <p>Post your first job to start receiving applications</p>
        </Empty>
      ) : (
        companyJobs.map(job => (
          <JobRow key={job.id}>
            <JobInfo>
              <h3>{job.title}</h3>
              <p>{job.location} · {job.type} · Posted {timeAgo(job.createdAt)}</p>
            </JobInfo>
            <Actions>
              <Badge><FiUsers size={12} />{job.applicationsCount || 0} applicants</Badge>
              <IconLink to={`/company/applications/${job.id}`}><FiEye size={14} /></IconLink>
              <IconLink to={`/company/edit-job/${job.id}`}><FiEdit2 size={14} /></IconLink>
              <IconBtn $danger onClick={() => handleDelete(job.id)}><FiTrash2 size={14} /></IconBtn>
            </Actions>
          </JobRow>
        ))
      )}
    </Page>
  )
}

export default CompanyDashboard
