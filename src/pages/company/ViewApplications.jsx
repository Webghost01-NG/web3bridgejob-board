import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { fetchJobApplications, updateApplicationStatus } from '../../features/applications/applicationsSlice'
import Spinner from '../../components/Spinner'
import { FiArrowLeft, FiMail, FiUser } from 'react-icons/fi'
import { formatDate } from '../../utils/formatDate'

const Page = styled.div`
  max-width: 900px;
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
  font-size: 1.5rem;
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
`

const CandidateInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`

const Avatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary}22;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`

const Info = styled.div`
  h4 { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.1rem; }
  p { color: ${({ theme }) => theme.colors.textMuted}; font-size: 0.8rem; display: flex; align-items: center; gap: 0.3rem; }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
`

const DateText = styled.span`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textMuted};
`

const StatusSelect = styled.select`
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
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.sm};
  padding: 0.4rem 0.7rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
`

const Empty = styled.div`
  text-align: center;
  padding: 4rem;
  color: ${({ theme }) => theme.colors.textMuted};
  h3 { color: ${({ theme }) => theme.colors.text}; margin-bottom: 0.5rem; }
`

const ViewApplications = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { jobApplications, loading } = useSelector((s) => s.applications)

  useEffect(() => { dispatch(fetchJobApplications(jobId)) }, [dispatch, jobId])

  const handleStatus = (id, status) => dispatch(updateApplicationStatus({ id, status }))

  return (
    <Page>
      <BackBtn onClick={() => navigate('/company/dashboard')}><FiArrowLeft /> Back to Dashboard</BackBtn>
      <Title>Applications</Title>
      <Sub>{jobApplications.length} candidate{jobApplications.length !== 1 ? 's' : ''} applied</Sub>

      {loading ? <Spinner /> : jobApplications.length === 0 ? (
        <Empty><h3>No applications yet</h3><p>Share your listing to attract candidates</p></Empty>
      ) : (
        jobApplications.map(app => (
          <AppCard key={app.id}>
            <CandidateInfo>
              <Avatar><FiUser size={16} /></Avatar>
              <Info>
                <h4>{app.candidateName}</h4>
                <p><FiMail size={11} />{app.candidateEmail}</p>
              </Info>
            </CandidateInfo>
            <Right>
              <DateText>Applied {formatDate(app.appliedAt)}</DateText>
              <StatusSelect
                $status={app.status}
                value={app.status}
                onChange={(e) => handleStatus(app.id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="reviewed">Reviewed</option>
                <option value="shortlisted">Shortlisted</option>
                <option value="rejected">Rejected</option>
              </StatusSelect>
            </Right>
          </AppCard>
        ))
      )}
    </Page>
  )
}

export default ViewApplications
