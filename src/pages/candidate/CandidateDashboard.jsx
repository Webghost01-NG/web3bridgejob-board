import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchJobs } from '../../features/jobs/jobsSlice'
import { fetchMyApplications } from '../../features/applications/applicationsSlice'
import JobCard from '../../components/JobCard'
import Spinner from '../../components/Spinner'
import { FiFileText, FiUser, FiBriefcase } from 'react-icons/fi'

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

const StatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
`

const StatCard = styled(Link)`
  display: block;
  background: ${({ theme }) => theme.colors.bgCard};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: 1.25rem 1.5rem;
  transition: border-color 0.2s;
  &:hover { border-color: ${({ theme }) => theme.colors.primary}; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.8rem; margin-bottom: 0.3rem; display: flex; align-items: center; gap: 0.4rem; }
  strong { font-size: 1.8rem; font-weight: 800; color: ${({ theme }) => theme.colors.primary}; }
`

const SectionTitle = styled.h2`
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1rem;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
`

const CandidateDashboard = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { jobs, loading: jobsLoading } = useSelector((s) => s.jobs)
  const { myApplications } = useSelector((s) => s.applications)

  useEffect(() => {
    dispatch(fetchJobs())
    if (user) dispatch(fetchMyApplications(user.uid))
  }, [dispatch, user])

  const recentJobs = jobs.slice(0, 6)

  return (
    <Page>
      <TopBar>
        <PageTitle>Hey, <span>{user?.displayName?.split(' ')[0]}</span> 👋</PageTitle>
      </TopBar>

      <StatsRow>
        <StatCard to="/candidate/applications">
          <p><FiFileText size={13} /> My Applications</p>
          <strong>{myApplications.length}</strong>
        </StatCard>
        <StatCard to="/jobs">
          <p><FiBriefcase size={13} /> Open Jobs</p>
          <strong>{jobs.length}</strong>
        </StatCard>
        <StatCard to="/candidate/profile">
          <p><FiUser size={13} /> Profile</p>
          <strong>→</strong>
        </StatCard>
      </StatsRow>

      <SectionTitle>Recent Listings</SectionTitle>
      {jobsLoading ? <Spinner /> : (
        <Grid>{recentJobs.map(job => <JobCard key={job.id} job={job} />)}</Grid>
      )}
    </Page>
  )
}

export default CandidateDashboard
