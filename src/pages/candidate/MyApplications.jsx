import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchMyApplications } from '../../features/applications/applicationsSlice'
import Spinner from '../../components/Spinner'
import { FiBriefcase, FiClock } from 'react-icons/fi'
import { formatDate } from '../../utils/formatDate'

const Page = styled.div`
  max-width: 900px;
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

const AppCard = styled.div`
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

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const CompanyInitial = styled.div`
  width: 44px;
  height: 44px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.1rem;
`

const Info = styled.div`
  h3 { font-size: 0.95rem; font-weight: 700; margin-bottom: 0.2rem; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.82rem; display: flex; align-items: center; gap: 0.3rem; }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const StatusBadge = styled.span`
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${({ $status, theme }) =>
    $status === 'shortlisted' ? theme.colors.success + '22' :
    $status === 'rejected' ? theme.colors.danger + '22' :
    $status === 'reviewed' ? theme.colors.warning + '22' :
    theme.colors.bgLight};
  color: ${({ $status, theme }) =>
    $status === 'shortlisted' ? theme.colors.success :
    $status === 'rejected' ? theme.colors.danger :
    $status === 'reviewed' ? theme.colors.warning :
    theme.colors.textMuted};
`

const ViewBtn = styled(Link)`
  background: ${({ theme }) => theme.colors.bgLight};
  color: ${({ theme }) => theme.colors.textMuted};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.35rem 0.7rem;
  font-size: 0.8rem;
  transition: all 0.2s;
  &:hover { color: ${({ theme }) => theme.colors.text}; }
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  h3 { color: ${({ theme }) => theme.colors.text}; margin-bottom: 0.5rem; }
  a { color: ${({ theme }) => theme.colors.primary}; font-weight: 600; }
`

const MyApplications = () => {
  const dispatch = useDispatch()
  const { user } = useSelector((s) => s.auth)
  const { myApplications, loading } = useSelector((s) => s.applications)

  useEffect(() => {
    if (user) dispatch(fetchMyApplications(user.uid))
  }, [dispatch, user])

  return (
    <Page>
      <Title>My Applications</Title>
      <Sub>Track all the jobs you've applied for</Sub>

      {loading ? <Spinner /> : myApplications.length === 0 ? (
        <Empty>
          <h3>No applications yet</h3>
          <p>Start applying! <Link to="/jobs">Browse open roles →</Link></p>
        </Empty>
      ) : (
        myApplications.map(app => (
          <AppCard key={app.id}>
            <Left>
              <CompanyInitial>{app.company?.[0]?.toUpperCase()}</CompanyInitial>
              <Info>
                <h3>{app.jobTitle}</h3>
                <p><FiBriefcase size={11} />{app.company}</p>
                <p><FiClock size={11} />Applied {formatDate(app.appliedAt)}</p>
              </Info>
            </Left>
            <Right>
              <StatusBadge $status={app.status}>{app.status}</StatusBadge>
              <ViewBtn to={`/jobs/${app.jobId}`}>View Job</ViewBtn>
            </Right>
          </AppCard>
        ))
      )}
    </Page>
  )
}

export default MyApplications
